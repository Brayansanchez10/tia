import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { CotizacionData } from '@/types/cotizacion'
import { amountInWordsEs, formatCOP, splitLines } from '@/lib/cotizacion/format'
import { resolveAssetUrl } from '@/lib/cotizacion/resolveAssetUrl'

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 44,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.45,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 18,
  },
  headerLogoColumn: {
    width: 172,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerLogoImage: {
    width: 168,
    height: 54,
    objectFit: 'contain',
  },
  headerAccentBar: {
    height: 4,
    width: '100%',
  },
  headerTextBlock: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  issuerName: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#f5f5f5',
  },
  issuerNit: {
    fontSize: 8,
    color: '#c8c8c8',
  },
  tagline: {
    marginTop: 4,
    fontSize: 8,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  metaDate: {
    fontSize: 9,
  },
  centerBlock: {
    marginTop: 22,
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 20,
    letterSpacing: 6,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  accentLine: {
    marginTop: 10,
    height: 2,
    width: 120,
  },
  clientPill: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    width: '100%',
  },
  clientName: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueBox: {
    marginTop: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  valueLabel: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  valueAmount: {
    marginTop: 8,
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  valueWords: {
    marginTop: 6,
    fontSize: 8,
    fontStyle: 'italic',
  },
  sectionEyebrow: {
    marginTop: 22,
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  conceptLine: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 11,
  },
  descHeading: {
    marginTop: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  blockTitle: {
    marginTop: 12,
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  bulletLine: {
    marginTop: 3,
    marginLeft: 10,
    paddingLeft: 6,
    borderLeftWidth: 1,
    fontSize: 9,
    lineHeight: 1.5,
  },
  closingProseWrap: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 2,
    width: '100%',
  },
  closingProseTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  closingProseLine: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 1.45,
  },
  unitCostPanel: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    width: '100%',
    alignItems: 'center',
  },
  unitCostPanelTitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unitCostPanelAmount: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unitCostPanelSuffix: {
    marginTop: 6,
    fontSize: 9,
    textAlign: 'center',
  },
  notesBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 4,
  },
  noteLine: {
    fontSize: 8.5,
    lineHeight: 1.5,
  },
  signOff: {
    marginTop: 28,
  },
  signName: {
    marginTop: 16,
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerBrand: {
    marginTop: 32,
    paddingTop: 10,
    borderTopWidth: 0.5,
    fontSize: 7,
    textAlign: 'center',
    letterSpacing: 1,
  },
})

type Props = {
  data: CotizacionData
}

export function CotizacionPdfDocument({ data }: Props) {
  const b = data.branding
  const inWords = amountInWordsEs(data.totalAmount)
  const footerLines = splitLines(data.footerNotes)
  const logoSrc = b.logoUrl.trim() ? resolveAssetUrl(b.logoUrl) : ''

  return (
    <Document
      title={`${b.documentTitle} — ${data.clientName}`}
      author={data.issuerName}
      language="es-CO"
    >
      <Page size="A4" style={[styles.page, { backgroundColor: b.paperBgColor, color: b.textColor }]} wrap>
        <View style={[styles.headerRow, { backgroundColor: b.headerBgColor }]}>
          {logoSrc ? (
            <View style={[styles.headerLogoColumn, { backgroundColor: b.headerBgColor }]}>
              <Image
                src={logoSrc}
                style={[styles.headerLogoImage, { backgroundColor: b.headerBgColor }]}
              />
            </View>
          ) : (
            <View
              style={[
                styles.headerLogoColumn,
                {
                  backgroundColor: b.headerBgColor,
                  borderWidth: 1,
                  borderColor: b.accentColor,
                },
              ]}
            >
              <Text style={{ color: b.accentColor, fontSize: 8, fontFamily: 'Helvetica', fontWeight: 'bold' }}>
                LOGO
              </Text>
            </View>
          )}
          <View style={styles.headerTextBlock}>
            <Text style={styles.issuerName}>{data.issuerName}</Text>
            <Text style={styles.issuerNit}>NIT {data.issuerNit}</Text>
            {b.tagline.trim() ? (
              <Text style={[styles.tagline, { color: b.accentColor }]}>{b.tagline}</Text>
            ) : null}
          </View>
        </View>
        <View style={[styles.headerAccentBar, { backgroundColor: b.accentColor }]} />

        <View style={[styles.metaRow, { borderBottomColor: b.mutedColor }]}>
          <Text style={[styles.metaDate, { color: b.mutedColor }]}>
            {data.city}, {data.dateLabel}
          </Text>
        </View>

        <View style={styles.centerBlock}>
          <Text style={[styles.docTitle, { color: b.textColor }]}>{b.documentTitle}</Text>
          <View style={[styles.accentLine, { backgroundColor: b.accentColor }]} />
        </View>

        <View
          style={[
            styles.clientPill,
            {
              backgroundColor: b.panelBgColor,
              borderLeftColor: b.accentColor,
            },
          ]}
        >
          <Text style={[styles.clientName, { color: b.textColor }]}>{data.clientName}</Text>
        </View>

        <View
          style={[
            styles.valueBox,
            {
              backgroundColor: b.panelBgColor,
              borderColor: b.accentColor,
            },
          ]}
        >
          <Text style={[styles.valueLabel, { color: b.mutedColor }]}>VALOR</Text>
          <Text style={[styles.valueAmount, { color: b.textColor }]}>{formatCOP(data.totalAmount)}</Text>
          {data.totalAmount > 0 ? (
            <Text style={[styles.valueWords, { color: b.mutedColor }]}>({inWords})</Text>
          ) : null}
        </View>

        <Text style={[styles.sectionEyebrow, { color: b.textColor }]}>POR CONCEPTO DE:</Text>
        <Text style={[styles.conceptLine, { color: b.textColor }]}>
          {data.conceptSummary.trim() ? data.conceptSummary : '—'}
        </Text>

        {data.descriptionBlocks.length > 0 ? (
          <>
            <Text style={[styles.descHeading, { color: b.accentColor }]}>Descripción</Text>
            {data.descriptionBlocks.map((block) => (
              <View key={block.id}>
                <Text style={[styles.blockTitle, { color: b.textColor }]}>{block.title}</Text>
                {splitLines(block.body).map((line, i) => (
                  <Text key={i} style={[styles.bulletLine, { borderLeftColor: b.accentColor, color: b.textColor }]}>
                    {line}
                  </Text>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {data.closingSectionTitle.trim() || data.closingSectionBody.trim() ? (
          <View
            style={[
              styles.closingProseWrap,
              {
                backgroundColor: b.panelBgColor,
                borderLeftColor: b.accentColor,
              },
            ]}
          >
            {data.closingSectionTitle.trim() ? (
              <Text style={[styles.closingProseTitle, { color: b.textColor }]}>
                {data.closingSectionTitle.trim()}
              </Text>
            ) : null}
            {splitLines(data.closingSectionBody).map((line, i) => (
              <Text key={i} style={[styles.closingProseLine, { color: b.textColor }]}>
                {line}
              </Text>
            ))}
          </View>
        ) : null}
        {data.unitCost != null && Number.isFinite(data.unitCost) ? (
          <View
            style={[
              styles.unitCostPanel,
              {
                backgroundColor: b.panelBgColor,
                borderColor: b.accentColor,
                borderLeftColor: b.accentColor,
              },
            ]}
          >
            <Text style={[styles.unitCostPanelTitle, { color: b.textColor }]}>
              {(data.unitCostHeading || '').trim() || 'Costo unitario'}
            </Text>
            <Text style={[styles.unitCostPanelAmount, { color: b.accentColor }]}>{formatCOP(data.unitCost)}</Text>
            {data.unitCostSuffix.trim() ? (
              <Text style={[styles.unitCostPanelSuffix, { color: b.mutedColor }]}>{data.unitCostSuffix.trim()}</Text>
            ) : null}
          </View>
        ) : null}

        {footerLines.length > 0 ? (
          <View style={[styles.notesBlock, { borderTopColor: b.mutedColor }]}>
            {footerLines.map((line, i) => (
              <Text key={i} style={[styles.noteLine, { color: b.mutedColor }]}>
                {line}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.signOff}>
          <Text style={{ color: b.textColor }}>Atentamente,</Text>
          <Text style={[styles.signName, { color: b.textColor }]}>{data.signerName}</Text>
          <Text style={{ marginTop: 6, fontSize: 9, color: b.mutedColor }}>TEL: {data.signerPhone}</Text>
        </View>

        <Text style={[styles.footerBrand, { color: b.mutedColor, borderTopColor: b.mutedColor }]}>
          {data.issuerName} · NIT {data.issuerNit}
        </Text>
      </Page>
    </Document>
  )
}
