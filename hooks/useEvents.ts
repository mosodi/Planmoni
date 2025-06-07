import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type Event = {
  id: string;
  user_id: string;
  type: 'payout_completed' | 'payout_scheduled' | 'vault_created' | 'disbursement_failed' | 'security_alert';
  title: string;
  description?: string;
  status: 'unread' | 'read';
  payout_plan_id?: string;
  transaction_id?: string;
  created_at: string;
  payout_plans?: {
    name: string;
    payout_amount: number;
    bank_account_id: string;
    bank_accounts?: {
      bank_name: string;
      account_number: string;
    };
  };
  transactions?: {
    amount: number;
    status: string;
    type: string;
  };
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchEvents();
      return setupRealtimeSubscription();
    }
  }, [session?.user?.id]);

  const fetchEvents = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('events')
        .select(`
          *,
          payout_plans (
            name,
            payout_amount,
            bank_account_id,
            bank_accounts (
              bank_name,
              account_number
            )
          ),
          transactions (
            amount,
            status,
            type
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Clean up existing channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel
    const channel = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${session?.user?.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchEvents(); // Refetch to get related data
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => 
              prev.map(event => 
                event.id === payload.new.id 
                  ? { ...event, ...payload.new }
                  : event
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => 
              prev.filter(event => event.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Store channel reference
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  };

  const markEventAsRead = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'read' })
        .eq('id', eventId)
        .eq('user_id', session?.user?.id);

      if (error) throw error;
      
      setEvents(prev =>
        prev.map(event =>
          event.id === eventId ? { ...event, status: 'read' } : event
        )
      );
    } catch (err) {
      console.error('Failed to mark event as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'read' })
        .eq('user_id', session?.user?.id)
        .eq('status', 'unread');

      if (error) throw error;
      
      setEvents(prev =>
        prev.map(event => ({ ...event, status: 'read' }))
      );
    } catch (err) {
      console.error('Failed to mark all events as read:', err);
    }
  };

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    markEventAsRead,
    markAllAsRead,
  };
}