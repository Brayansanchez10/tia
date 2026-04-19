import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { computeReciboTotals } from '@/lib/recibo/reciboTotals'
import { resolveAssetUrl } from '@/lib/cotizacion/resolveAssetUrl'
import { formatCOP, splitLines } from '@/lib/cotizacion/format'
import type { ReciboData } from '@/types/recibo'

/** Texto sobre franja oscura (misma idea que cotización). */
const ON_HEADER_MAIN = '#f5f5f5'
const ON_HEADER_SUB = '#c8c8c8'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 36,
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  headerStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
  },
  titleBlock: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 120,
    justifyContent: 'center',
    minWidth: 100,
  },
  titleRecibo: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: ON_HEADER_MAIN,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  receiptNumber: {
    marginTop: 6,
    fontSize: 9,
    color: ON_HEADER_SUB,
    letterSpacing: 0.5,
  },
  taglineOnHeader: {
    marginTop: 5,
    fontSize: 7,
    letterSpacing: 0.4,
  },
  logoCol: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 160,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  logoImg: {
    width: 220,
    height: 50,
    objectFit: 'contain',
  },
  accentBar: {
    height: 4,
    width: '100%',
    marginBottom: 18,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  columnHalf: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  columnBody: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  dateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  dateBarText: {
    color: ON_HEADER_MAIN,
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  tableHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
  },
  tableHeadText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  tableBody: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e8e4dc',
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e4dc',
  },
  lineDesc: {
    flex: 3,
    paddingRight: 12,
    fontSize: 9,
  },
  lineAmount: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
    fontFamily: 'Helvetica',
  },
  totalsBlock: {
    marginTop: 16,
    alignItems: 'flex-end',
    paddingRight: 2,
  },
  totalRowSmall: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginBottom: 4,
  },
  totalRowSmallLabel: {
    fontSize: 9,
    width: 120,
    textAlign: 'right',
  },
  totalRowSmallValue: {
    fontSize: 9,
    minWidth: 92,
    textAlign: 'right',
    fontFamily: 'Helvetica',
  },
  dividerGold: {
    width: 220,
    height: 2,
    marginTop: 8,
    marginBottom: 10,
  },
  totalBigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginTop: 2,
  },
  totalWord: {
    fontSize: 17,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  totalAmountBig: {
    fontSize: 17,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  signatureBlock: {
    marginTop: 22,
    alignItems: 'flex-end',
    width: '100%',
    maxWidth: 320,
  },
  signatureLine: {
    width: 160,
    borderBottomWidth: 0.5,
  },
  signatureName: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    marginTop: 8,
  },
  signaturePhone: {
    marginTop: 4,
    fontSize: 8,
  },
  footerPanel: {
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
  },
  footerTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  footerBody: {
    fontSize: 8,
    lineHeight: 1.45,
  },
})

type Props = {
  data: ReciboData
}

export function ReciboPdfDocument({ data }: Props) {
  const b = data.branding
  const { subtotal, tax, total } = computeReciboTotals(data)
  const logoSrc = b.logoUrl.trim() ? resolveAssetUrl(b.logoUrl) : ''
  const showTax = data.taxRatePercent > 0
  const rateLabel =
    Number.isInteger(data.taxRatePercent) || data.taxRatePercent % 1 === 0
      ? `${Math.round(data.taxRatePercent)}`
      : String(data.taxRatePercent).replace(/\.?0+$/, '')

  const linesToRender =
    data.lines.length > 0
      ? data.lines
      : [{ id: 'empty', description: '', amount: 0 as number }]

  return (
    <Document
      title={['Recibo', data.receiptNumber.trim() || 'borrador'].filter(Boolean).join(' ')}
      language="es-CO"
    >
      <Page size="A4" style={[styles.page, { backgroundColor: b.paperBgColor, color: b.textColor }]} wrap>
        <View style={[styles.headerStrip, { backgroundColor: b.headerBgColor }]}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleRecibo}>RECIBO</Text>
            <Text style={styles.receiptNumber}>{data.receiptNumber.trim() || '—'}</Text>
            {b.tagline.trim() ? (
              <Text style={[styles.taglineOnHeader, { color: b.accentColor }]}>{b.tagline}</Text>
            ) : null}
          </View>
          <View style={[styles.logoCol, { backgroundColor: b.headerBgColor }]}>
            {logoSrc ? (
              <Image
                src={logoSrc}
                style={[styles.logoImg, { backgroundColor: b.headerBgColor }]}
              />
            ) : (
              <Text style={{ fontSize: 8, color: b.accentColor }}>LOGO</Text>
            )}
          </View>
        </View>
        <View style={[styles.accentBar, { backgroundColor: b.accentColor }]} />

        <View style={[styles.columnsRow, { borderBottomColor: b.mutedColor }]}>
          <View style={styles.columnHalf}>
            <Text style={[styles.columnLabel, { color: b.mutedColor }]}>De</Text>
            {splitLines(data.fromAddress).map((line, i) => (
              <Text key={i} style={[styles.columnBody, { color: b.textColor }]}>
                {line}
              </Text>
            ))}
          </View>
          <View style={styles.columnHalf}>
            <Text style={[styles.columnLabel, { color: b.mutedColor }]}>A</Text>
            {data.toAddress.trim() ? (
              splitLines(data.toAddress).map((line, i) => (
                <Text key={i} style={[styles.columnBody, { color: b.textColor }]}>
                  {line}
                </Text>
              ))
            ) : (
              <Text style={[styles.columnBody, { color: b.mutedColor }]}>—</Text>
            )}
          </View>
        </View>

        <View style={[styles.dateBar, { backgroundColor: b.headerBgColor }]}>
          <Text style={styles.dateBarText}>Fecha</Text>
          <Text style={styles.dateBarText}>{data.dateDisplay.trim() || '—'}</Text>
        </View>

        <View
          style={[
            styles.tableHead,
            { backgroundColor: b.panelBgColor, borderBottomColor: b.accentColor },
          ]}
        >
          <Text style={[styles.tableHeadText, { flex: 3, color: b.textColor }]}>Descripción</Text>
          <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: b.textColor }]}>
            Importe
          </Text>
        </View>

        <View style={[styles.tableBody, { backgroundColor: b.paperBgColor }]}>
          {linesToRender.map((line) => (
            <View key={line.id} style={styles.lineRow} wrap={false}>
              <Text style={[styles.lineDesc, { color: b.textColor }]}>
                {line.description.trim() ? line.description : '—'}
              </Text>
              <Text style={[styles.lineAmount, { color: b.textColor }]}>
                {formatCOP(Math.max(0, Math.round(line.amount)))}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalRowSmall}>
            <Text style={[styles.totalRowSmallLabel, { color: b.mutedColor }]}>Subtotal</Text>
            <Text style={[styles.totalRowSmallValue, { color: b.textColor }]}>{formatCOP(subtotal)}</Text>
          </View>
          {showTax ? (
            <View style={styles.totalRowSmall}>
              <Text style={[styles.totalRowSmallLabel, { color: b.mutedColor }]}>
                Impuestos {rateLabel}%
              </Text>
              <Text style={[styles.totalRowSmallValue, { color: b.textColor }]}>{formatCOP(tax)}</Text>
            </View>
          ) : null}
          <View style={[styles.dividerGold, { backgroundColor: b.accentColor }]} />
          <View style={styles.totalBigRow}>
            <Text style={[styles.totalWord, { color: b.textColor }]}>Total</Text>
            <Text style={[styles.totalAmountBig, { color: b.accentColor }]}>{formatCOP(total)}</Text>
          </View>
        </View>

        {data.signerName.trim() ? (
          <View style={styles.signatureBlock}>
            <View style={[styles.signatureLine, { borderBottomColor: b.mutedColor }]} />
            <Text style={[styles.signatureName, { color: b.textColor }]}>{data.signerName}</Text>
            {data.signerPhone.trim() ? (
              <Text style={[styles.signaturePhone, { color: b.mutedColor }]}>Tel: {data.signerPhone}</Text>
            ) : null}
          </View>
        ) : null}

        <View
          style={[
            styles.footerPanel,
            {
              backgroundColor: b.panelBgColor,
              borderLeftColor: b.accentColor,
            },
          ]}
          wrap={false}
        >
          <Text style={[styles.footerTitle, { color: b.textColor }]}>{data.footerTermsTitle}</Text>
          {splitLines(data.footerTermsBody).map((line, i) => (
            <Text key={i} style={[styles.footerBody, { color: b.mutedColor }]}>
              {line}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  )
}
