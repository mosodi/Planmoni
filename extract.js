import yauzl from 'yauzl';
import fs from 'fs';
import path from 'path';

const zipFilePath = 'Payout Plan Implementations - Planmoni.zip';

yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
  if (err) {
    console.error('Error opening zip file:', err);
    return;
  }

  console.log(`Extracting ${zipFilePath}...`);
  
  zipfile.readEntry();
  
  zipfile.on('entry', (entry) => {
    const fileName = entry.fileName;
    console.log(`Extracting: ${fileName}`);
    
    if (/\/$/.test(fileName)) {
      // Directory entry
      fs.mkdirSync(fileName, { recursive: true });
      zipfile.readEntry();
    } else {
      // File entry
      const dirName = path.dirname(fileName);
      if (dirName !== '.') {
        fs.mkdirSync(dirName, { recursive: true });
      }
      
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) {
          console.error('Error reading entry:', err);
          return;
        }
        
        const writeStream = fs.createWriteStream(fileName);
        readStream.pipe(writeStream);
        
        writeStream.on('close', () => {
          zipfile.readEntry();
        });
      });
    }
  });
  
  zipfile.on('end', () => {
    console.log('Extraction complete!');
    
    // List extracted contents
    console.log('\nExtracted contents:');
    try {
      const files = fs.readdirSync('.', { withFileTypes: true });
      files.forEach(file => {
        const stats = fs.statSync(file.name);
        const type = file.isDirectory() ? 'd' : '-';
        const size = stats.size;
        const modified = stats.mtime.toISOString().slice(0, 19).replace('T', ' ');
        console.log(`${type}rwxr-xr-x 1 user user ${size.toString().padStart(8)} ${modified} ${file.name}`);
      });
    } catch (error) {
      console.error('Error listing files:', error);
    }
  });
});