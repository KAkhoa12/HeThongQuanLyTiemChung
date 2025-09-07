import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Đăng ký font tiếng Việt - sử dụng Roboto từ Google Fonts CDN
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-vietnamese-400-normal.woff',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-vietnamese-700-normal.woff',
      fontWeight: 700,
    },
  ],
});

// Hoặc sử dụng font Noto Sans (hỗ trợ tiếng Việt tốt)
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosans/v28/o-0IIpQlx3QUlC5A4PNr5TRA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosans/v28/o-0NIpQlx3QUlC5A4PNjXhFVZNyB.woff2',
      fontWeight: 700,
    },
  ],
});

// Create styles với font family hỗ trợ tiếng Việt
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto', // Sử dụng font Roboto cho toàn bộ page
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  line: {
    height: 1,
    backgroundColor: '#4285f4',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  basicInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 700,
    width: 120, // Tăng width để chứa text tiếng Việt
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  infoValue: {
    fontSize: 10,
    flex: 1,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4285f4',
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontSize: 9, // Tăng size một chút
    fontWeight: 700,
    color: '#FFFFFF',
    flex: 1,
    fontFamily: 'Roboto',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRowEven: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    fontSize: 9, // Tăng size một chút
    flex: 1,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  summaryContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  summaryValue: {
    fontSize: 10,
    color: '#1a1a1a',
    fontFamily: 'Roboto',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666666',
    fontFamily: 'Roboto',
  },
});

export interface PDFTableData {
  headers: string[];
  rows: any[][];
}

export const generatePDF = (
  title: string,
  basicInfo: Record<string, any>,
  tableData?: PDFTableData,
  summaryData?: Record<string, any>
) => {
  // Split basic info into two columns
  const entries = Object.entries(basicInfo);
  const leftColumn: [string, any][] = [];
  const rightColumn: [string, any][] = [];
  
  entries.forEach(([key, value], index) => {
    if (index % 2 === 0) {
      leftColumn.push([key, value]);
    } else {
      rightColumn.push([key, value]);
    }
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.line} />

        {/* Basic Information */}
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        <View style={styles.basicInfoContainer}>
          <View style={styles.leftColumn}>
            {leftColumn.map(([key, value], index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{key}:</Text>
                <Text style={styles.infoValue}>{String(value || '-')}</Text>
              </View>
            ))}
          </View>
          <View style={styles.rightColumn}>
            {rightColumn.map(([key, value], index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{key}:</Text>
                <Text style={styles.infoValue}>{String(value || '-')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Table */}
        {tableData && tableData.rows.length > 0 && (
          <View style={styles.table}>
            <Text style={styles.sectionTitle}>Chi tiết</Text>
            <View style={styles.tableHeader}>
              {tableData.headers.map((header, index) => (
                <Text key={index} style={styles.tableHeaderText}>
                  {header}
                </Text>
              ))}
            </View>
            {tableData.rows.map((row, rowIndex) => (
              <View 
                key={rowIndex} 
                style={[
                  styles.tableRow,
                  rowIndex % 2 === 0 ? styles.tableRowEven : {}
                ]}
              >
                {row.map((cell, cellIndex) => (
                  <Text key={cellIndex} style={styles.tableCell}>
                    {String(cell || '-')}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Summary */}
        {summaryData && Object.keys(summaryData).length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Tổng kết</Text>
            {Object.entries(summaryData).map(([key, value], index) => (
              <View key={index} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{key}:</Text>
                <Text style={styles.summaryValue}>{String(value || '-')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</Text>
          <Text>Trang 1 / 1</Text>
        </View>
      </Page>
    </Document>
  );

  return pdf(<MyDocument />);
};

export const downloadPDF = async (pdfDoc: any, filename: string) => {
  try {
    // Generate PDF blob
    const blob = await pdfDoc.toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('PDF downloaded successfully:', filename);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Không thể tạo PDF. Vui lòng thử lại sau.');
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Hàm helper để xử lý text tiếng Việt an toàn
export const safeVietnameseText = (text: string | null | undefined): string => {
  if (!text) return '-';
  // Đảm bảo text là string và loại bỏ các ký tự đặc biệt có thể gây lỗi
  return String(text).trim();
};

// Ví dụ sử dụng với dữ liệu tiếng Việt
export const generateVietnamesePDF = () => {
  const basicInfo = {
    'Mã phiếu': 'PN001',
    'Ngày tạo': formatDate(new Date().toISOString()),
    'Người tạo': 'Nguyễn Văn A',
    'Trạng thái': 'Đã duyệt',
    'Địa điểm': 'Kho Hà Nội',
    'Ghi chú': 'Nhập hàng tháng 12'
  };

  const tableData: PDFTableData = {
    headers: ['STT', 'Tên vaccine', 'Số lô', 'Số lượng', 'Đơn giá', 'Thành tiền'],
    rows: [
      ['1', 'Vaccine COVID-19', 'LOT001', '100', formatCurrency(500000), formatCurrency(50000000)],
      ['2', 'Vaccine cúm mùa', 'LOT002', '50', formatCurrency(300000), formatCurrency(15000000)],
    ]
  };

  const summaryData = {
    'Tổng số lượng': '150',
    'Tổng tiền': formatCurrency(65000000),
    'VAT (10%)': formatCurrency(6500000),
    'Tổng cộng': formatCurrency(71500000)
  };

  return generatePDF(
    'PHIẾU NHẬP KHO VACCINE',
    basicInfo,
    tableData,
    summaryData
  );
};