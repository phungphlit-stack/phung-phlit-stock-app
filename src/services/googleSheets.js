const SHEET_ID = '1SaQtm7k5CBdlzcqZX2tlbFyrIRwo00coFphFxS7tXQs';

export const fetchStockFromSheets = async (role = 'backoffice') => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/query?tqx=out:json`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    const jsonString = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonString);
    
    if (!data.table || !data.table.rows) {
      return [];
    }

    let stocks = data.table.rows.map((row, index) => {
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

    // Filter by role: back-office (ID 1-25), front-store (ID 26-67)
    if (role === 'backoffice') {
      stocks = stocks.filter(item => item.id <= 25);
    } else if (role === 'frontstore') {
      stocks = stocks.filter(item => item.id > 25);
      // Renumber front-store items from 1
      stocks = stocks.map((item, idx) => ({ ...item, id: idx + 1 }));
    }

    return stocks;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
};
