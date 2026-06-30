const SHEET_ID = '1SaQtm7k5CBdlzcqZX2tlbFyrIRwo00coFphFxS7tXQs';

export const fetchStockFromSheets = async (role = 'backoffice') => {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    const lines = csvText.split('\n').filter(line => line.trim());
    const stocks = lines.slice(1).map((line, index) => {
      const cols = line.split(',');
      return {
        id: parseInt(cols[0]) || index + 1,
        name_th: cols[1]?.trim() || '',
        name_en: cols[1]?.trim() || '',
        category: cols[2]?.trim() || 'อื่นๆ',
        qty: Math.max(0, parseInt(cols[3]) || 0),
        unit: cols[4]?.trim() || 'แพ็ค',
        minAlert: Math.max(0, parseInt(cols[5]) || 1),
        lastUpdatedBy: 'Google Sheet',
        lastUpdatedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
    });

    // Filter by role: back-office (ID 1-25), front-store (ID 26-67)
    let filtered = stocks;
    if (role === 'backoffice') {
      filtered = stocks.filter(item => item.id <= 25);
    } else if (role === 'frontstore') {
      filtered = stocks.filter(item => item.id > 25);
      filtered = filtered.map((item, idx) => ({ ...item, id: idx + 1 }));
    }

    return filtered;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
};
