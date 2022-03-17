import JSZip from "jszip";
import * as vc from "vc-js";

import jsigs from 'jsonld-signatures';
import {contexts} from 'security-context';
import {RSAKeyPair, Ed25519KeyPair} from 'crypto-ld';
import documentLoaders from 'jsonld';
import {credentialsv1, testCertificateContext, testCertificateContextUrl} from './credentials'
import { Observable, of } from "rxjs";
import { CsVerifyCertificateRequest } from "../../services/certificate";

type Primitive = string | number | boolean;

interface SortCriteria {
  [key: string]: 'asc' | 'desc' | SortComprehension;
}

interface SortComprehension {
  order: 'asc' | 'desc';
  preference?: Primitive[];
}


const urlPath = "/certificate";
const registerMemberLimit = 4;
// const certificatePublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnXQalrgztecTpc+INjRQ8s73FSE1kU5QSlwBdICCVJBUKiuQUt7s+Z5epgCvLVAOCbP1mm5lV7bfgV/iYWDio7lzX4MlJwDedWLiufr3Ajq+79CQiqPaIbZTo0i13zijKtX7wgxQ78wT/HkJRLkFpmGeK3za21tEfttytkhmJYlwaDTEc+Kx3RJqVhVh/dfwJGeuV4Xc/e2NH++ht0ENGuTk44KpQ+pwQVqtW7lmbDZQJoOJ7HYmmoKGJ0qt2hrj15uwcD1WEYfY5N7N0ArTzPgctExtZFDmituLGzuAZfv2AZZ9/7Y+igshzfB0reIFdUKw3cdVTzfv5FNrIqN5pwIDAQAB\n-----END PUBLIC KEY-----\n"
// const certificatePublicKey = "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzQjk6ArVghXPS4ST7DLj386ze/ZrTXX3xXpRKeRqVe8ZMNUnbWlbZjAMUNkZ+QZwYfIxJYdsVQt+WukNIxvtDzp3zA2jlFyCgK7c/12wly+AnO6pr3fX/qXh1/ryuY0blCeRnZNk2BYsw3wF5z/p1NvyqIWmqz0Jwphy1qHTBpoOv302L8ZQbptOmjuTc9Wkjn1xXCvv2nUW14rOkvcEVdXhpn//hCaWqOZbL5WNpEbDOTg/CrnprltpZGCKJX6X236xvRkzqcf9nxBsojO1mNII4bxPUHyV++4LcIRtrO+j0lmZ0rwfoIqvelxumym7HxTQ4yH3vXIPH9sHT4KOu+fAallD5ii9wtHUnzODqZB4SKfJcRSIoNzUX5qRFcBQp73Vq5jhHdm7UDJimKKIVlbQA4hZmZ5qNgNgfVln7DuMwDx1YgsisaibouODgHsvmlwKWmcMiaMw+ooGRF51DTV5BA1xOHVLFnY9v9hGELPncrqrCWi/2JsKKgoFjDVw8xAY+UIu/theVwo5aaF0eBqn8ZJdtlXUJEF+5Iwsj32c7F3h2jVIYowf8kxYqgvOuHLETARdRzCk0flOdbCXW7HSnmPC3yu0pF6vdJo/eGCA7A12i8DYukVmQ9Wy54tGAnKvz8CBFcB+gbE+Q1V4qTJNX10SZyWaXV7XKQYygsECAwEAAQ==-----END PUBLIC KEY-----\n"
const certificatePublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtu87YH+XEkHB+Id7/xmN\nxG6UNCPYyNQeWGvD73oCoPTy6f+L8OOpfEK+P2BCkyKR59L/QL8Mkyn4KTw39LUk\nDtD4ijJC5wt2+f1Si1/d/ZguZ/LFXhqXSZHN18f1sedJjPPr20EyJp0IAoBPap5U\nkCeLGMv0lto+iqasEVRC0o7hbICFrnzFTOl5CTUDYMOndn3XEcK0KdLlhsPfQp0n\nZXCZHbisL1LPD3vqZ/7HKWfr+qsIxYt9aikBaOFg5mMoMvE4sLZTwMm+ElB1HH3h\nhaVnFjycGBwy4A8jzGWy/y++YQy5n0VUlKT2gk62/dHgPKK3NUY2YPBOfuOyBmYp\nwQIDAQAB\n-----END PUBLIC KEY-----'
const certificatePublicKeyBase58 = "DaipNW4xaH2bh1XGNNdqjnSYyru3hLnUgTBSfSvmZ2hi";

const CERTIFICATE_CONTROLLER_ID =  'https://sunbird.org/';
const CERTIFICATE_NAMESPACE =  "https://cvstatus.icmr.gov.in/credentials/testCertificate/v1";
const CERTIFICATE_PUBKEY_ID =  'https://cvstatus.icmr.gov.in/i/india';
const CERTIFICATE_DID =  'did:india';
const CERTIFICATE_SCAN_TIMEOUT =  '45000';
const CERTIFICATE_SIGNED_KEY_TYPE =  'RSA';



export class CertificateVerifier {

    private static publicKey = '';

    public static getDataFromQr(req: CsVerifyCertificateRequest): Promise<any>{
        this.publicKey = req.publicKey;
        const zippedData = atob(req.scannedData.split('data=')[1]);
        const zip = new JSZip();
        return zip.loadAsync(zippedData).then((contents) => {
            console.log('after unzip', contents)
            return contents.files['certificate.json'].async('text')
          }).then( (contents) => {
            console.log('contents', contents);
            return this.verifyData(contents);
          }).catch(err => {
            console.log('error', err)
              }
          );
    }

    public static async verifyData(certificateData): Promise<any>{
        try {
            const signedJSON = JSON.parse(certificateData);
            const {AssertionProofPurpose} = jsigs.purposes;
            console.log('signedJSON', signedJSON)
            console.log('AssertionProofPurpose', AssertionProofPurpose)
            let result;
            // debugger
            console.log('in if')
            const publicKey = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_DID,
                type: 'RsaVerificationKey2018',
                controller: CERTIFICATE_CONTROLLER_ID,
                publicKeyPem: certificatePublicKey
            };
            const controller = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_CONTROLLER_ID,
                publicKey: [publicKey],
                // this authorizes this key to be used for making assertions
                assertionMethod: [publicKey.id]
            };
            const key = new RSAKeyPair({...publicKey});
            const {RsaSignature2018} = jsigs.suites;
            result = await jsigs.verify(signedJSON, {
                suite: new RsaSignature2018({key}),
                purpose: new AssertionProofPurpose({controller}),
                documentLoader: this.customLoader,
                compactProof: false
            });
            result.certificateData = signedJSON;
            console.log('result in csl', result)
            return result;
            
        } catch (e) {
            console.log('Invalid data', e);
            throw new Error('Invalid data');
        }
    }
    
    public static customLoader = url => {
        console.log("checking " + url);
        const c = {
            "did:india": this.publicKey,
            "https://example.com/i/india": this.publicKey,
            "https://w3id.org/security/v1": contexts.get("https://w3id.org/security/v1"),
            'https://www.w3.org/2018/credentials#': credentialsv1,
            "https://www.w3.org/2018/credentials/v1": credentialsv1,
            [testCertificateContextUrl]: testCertificateContext,
        };
        let context = c[url];
        if (context === undefined) {
            console.log('context === undefined', contexts[url])
            context = contexts[url];
        }
        if (context !== undefined) {
            const c = {
                contextUrl: null,
                documentUrl: url,
                document: context
            };
            console.log('context !== undefined', c);
            return c;
    
        }
        if (url.startsWith("{")) {
            return JSON.parse(url);
        }
        console.log("Fallback url lookup for document :" + url)
        // Todo
        return documentLoaders({secure: false, strictSSL: false, request: 'request'})(url);
    };
  
}
