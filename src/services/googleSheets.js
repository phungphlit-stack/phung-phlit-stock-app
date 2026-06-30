const BACKOFFICE_SHEET_ID = '1fSntvIkixMI45eKEI9l_3q6GOO--RzKrouGx8R1TDt4';
const FRONTSTORE_SHEET_ID = '1ZSSW0W4SEeoQoZY9Wx3_NZg8TDxQwrV2WY8tLmtv9JI';

export const fetchStockFromSheets = async (role = 'backoffice') => {
  try {
    const sheetId = role === 'backoffice' ? BACKOFFICE_SHEET_ID : FRONTSTORE_SHEET_ID;
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/query?tqx=out:json`;
    
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
