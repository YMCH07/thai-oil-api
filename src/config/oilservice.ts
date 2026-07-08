import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { decode } from 'he';

export class PttOilService {
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: true,
    trimValues: true,
  });

  async getCurrentOilPrice() {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPrice xmlns="http://www.pttor.com">
      <Language>EN</Language>
    </CurrentOilPrice>
  </soap12:Body>
</soap12:Envelope>`;

    const response = await axios.post(
      'https://orapiweb.pttor.com/oilservice/OilPrice.asmx',
      xml,
      {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
        },
      },
    );

    // ---------------------------
    // STEP 1 : Parse SOAP XML
    // ---------------------------
    const soap = this.parser.parse(response.data);

    console.log('SOAP');
    console.log(JSON.stringify(soap, null, 2));

    // ---------------------------
    // STEP 2 : ดึง XML String
    // ---------------------------
    const xmlString =
      soap['soap:Envelope']['soap:Body']
          .CurrentOilPriceResponse
          .CurrentOilPriceResult;

    console.log('\nXML String');
    console.log(xmlString);

    // ---------------------------
    // STEP 3 : Decode HTML Entity
    // ---------------------------
    const decodedXml = decode(xmlString);

    console.log('\nDecoded XML');
    console.log(decodedXml);

    // ---------------------------
    // STEP 4 : Parse XML อีกครั้ง
    // ---------------------------
    const result = this.parser.parse(decodedXml);

    console.log('\nResult');
    console.log(JSON.stringify(result, null, 2));

    return result.PTTOR_DS.FUEL;
  }
}