const SHEET_ID = '1igTfe8iVtGfgeDsr6U336ZdKZgx5XI0EvYSsBftryyA';
const SHEET_NAME = 'เช็คสต็อก (ประจำวัน) cnx';

export const fetchStockFromSheets = async () => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/query?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    const jsonString = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonString);
    
    if (!data.table || !data.table.rows) {
      return [];
    }

    const stocks = data.table.rows.map((row, index) => {
      const cells = row.c;
      return {
        id: parseInt(cells[0]?.v || index + 1),
        name_th: cells[1]?.v || '',
        name_en: cells[1]?.v || '',
        category: cells[2]?.v || 'อื่นๆ',
        qty: Math.max(0, parseInt(cells[3]?.v || 0)),
        unit: cells[4]?.v || 'แพ็ค',
        minAlert: Math.max(0, parseInt(cells[5]?.v || 1)),
        lastUpdatedBy: 'Google Sheet',
        lastUpdatedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
    });

    return stocks;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
};
