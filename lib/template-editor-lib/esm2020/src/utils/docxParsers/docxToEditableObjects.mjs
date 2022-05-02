import * as JSZipImport from "jszip";
import { parseString } from 'xml2js-preserve-spaces';
export const docxToEditableObjects = async (docxFile) => {
    const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
    return new Promise((resolve, reject) => {
        // unzip the file
        console.log(JSZip);
        const zip = new JSZip();
        zip.loadAsync(docxFile).then(function (zip) {
            // get the content of the document.xml file
            const wordFolder = zip.folder('word');
            if (!wordFolder) {
                reject(`An error ocurred attempting to enter to the folder 'word' of the docx file.`);
                return;
            }
            const file = wordFolder.file("document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async('string').then(function (XMLContent) {
                const phrases = [];
                parseString(XMLContent, function (err, result) {
                    const paragraphs = result['w:document']['w:body'][0]['w:p'];
                    const enter = '\r\n';
                    let phrase;
                    paragraphs.forEach((paragraph, paragraphIndex) => {
                        const wRLabels = paragraph['w:r'];
                        if (!wRLabels || !wRLabels.length) {
                            phrase = { value: enter, paragraphIndex, sentenseIndex: 0 };
                            phrases.push(phrase);
                        }
                        else {
                            wRLabels.forEach((wRLabel, wRLabelIndex) => {
                                let text = '';
                                const WTLabel = wRLabel['w:t'];
                                // check if WTLabel is an object and has the "_" property
                                if (WTLabel && WTLabel.length && WTLabel[0]['_']) {
                                    text = WTLabel[0]['_'];
                                }
                                else {
                                    if (WTLabel && WTLabel.length && typeof WTLabel[0] === 'string') {
                                        text = WTLabel[0];
                                    }
                                    else if (WTLabel && WTLabel.length && WTLabel[0]['$']) {
                                        text = " ";
                                    }
                                }
                                phrase = { value: text, paragraphIndex, sentenseIndex: wRLabelIndex };
                                phrases.push(phrase);
                            });
                        }
                    });
                    resolve(phrases);
                });
            });
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jeFRvRWRpdGFibGVPYmplY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb0VkaXRhYmxlT2JqZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssV0FBVyxNQUFNLE9BQU8sQ0FBQztBQUNyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFHcEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxFQUFFLFFBQXlCLEVBQTZCLEVBQUU7SUFDbEcsTUFBTSxLQUFLLEdBQUcsT0FBTyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLGlCQUFpQjtRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDeEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHO1lBQ3hDLDJDQUEyQztZQUMzQyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3JDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLDZFQUE2RSxDQUFDLENBQUM7Z0JBQUMsT0FBTTthQUFFO1lBQ2xILE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDNUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFBRSxNQUFNLENBQUMsNkdBQTZHLENBQUMsQ0FBQztnQkFBQyxPQUFNO2FBQUU7WUFDNUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxVQUFVO2dCQUM1QyxNQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFBO2dCQUNwQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxFQUFFLE1BQU07b0JBQzNDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDM0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFBO29CQUNwQixJQUFJLE1BQXNCLENBQUE7b0JBRTFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFzRCxFQUFFLGNBQXNCLEVBQUUsRUFBRTt3QkFFcEcsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNqQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTs0QkFDakMsTUFBTSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFBOzRCQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3lCQUNyQjs2QkFBTTs0QkFDTCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBZ0MsRUFBRSxZQUFZLEVBQUUsRUFBRTtnQ0FDbEUsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO2dDQUN0QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Z0NBQzlCLHlEQUF5RDtnQ0FDekQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7b0NBQ2hELElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7aUNBQ3ZCO3FDQUFNO29DQUNMLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO3dDQUMvRCxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO3FDQUNsQjt5Q0FBTSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3Q0FDdkQsSUFBSSxHQUFHLEdBQUcsQ0FBQTtxQ0FDWDtpQ0FDRjtnQ0FDRCxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLENBQUE7Z0NBQ3JFLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7NEJBQ3RCLENBQUMsQ0FBQyxDQUFBO3lCQUNIO29CQUVILENBQUMsQ0FBQyxDQUFBO29CQUVGLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDbEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBKU1ppcEltcG9ydCBmcm9tIFwianN6aXBcIjtcclxuaW1wb3J0IHsgcGFyc2VTdHJpbmcgfSBmcm9tICd4bWwyanMtcHJlc2VydmUtc3BhY2VzJ1xyXG5pbXBvcnQgeyBJbnB1dEZpbGVGb3JtYXQsIEVkaXRhYmxlUGhyYXNlIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZG9jeFRvRWRpdGFibGVPYmplY3RzID0gYXN5bmMgKGRvY3hGaWxlOiBJbnB1dEZpbGVGb3JtYXQpOiBQcm9taXNlPEVkaXRhYmxlUGhyYXNlW10+ID0+IHtcclxuICBjb25zdCBKU1ppcCA9IHR5cGVvZiBKU1ppcEltcG9ydCA9PT0gXCJmdW5jdGlvblwiID8gSlNaaXBJbXBvcnQgOiBKU1ppcEltcG9ydFtcImRlZmF1bHRcIl07XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIC8vIHVuemlwIHRoZSBmaWxlXHJcbiAgICBjb25zb2xlLmxvZyhKU1ppcClcclxuICAgIGNvbnN0IHppcCA9IG5ldyBKU1ppcCgpO1xyXG4gICAgemlwLmxvYWRBc3luYyhkb2N4RmlsZSkudGhlbihmdW5jdGlvbiAoemlwKSB7XHJcbiAgICAgIC8vIGdldCB0aGUgY29udGVudCBvZiB0aGUgZG9jdW1lbnQueG1sIGZpbGVcclxuICAgICAgY29uc3Qgd29yZEZvbGRlciA9IHppcC5mb2xkZXIoJ3dvcmQnKVxyXG4gICAgICBpZiAoIXdvcmRGb2xkZXIpIHsgcmVqZWN0KGBBbiBlcnJvciBvY3VycmVkIGF0dGVtcHRpbmcgdG8gZW50ZXIgdG8gdGhlIGZvbGRlciAnd29yZCcgb2YgdGhlIGRvY3ggZmlsZS5gKTsgcmV0dXJuIH1cclxuICAgICAgY29uc3QgZmlsZSA9IHdvcmRGb2xkZXIuZmlsZShcImRvY3VtZW50LnhtbFwiKVxyXG4gICAgICBpZiAoIWZpbGUpIHsgcmVqZWN0KGBBbiBlcnJvciBvY3VycmVkIGF0dGVtcHRpbmcgdG8gZW50ZXIgdG8gdGhlIGxvYWQgdGhlIGZpbGUgJ2RvY3VtZW50LnhtbCcgaW4gZm9sZGVyICd3b3JkJyBvZiB0aGUgZG9jeCBmaWxlLmApOyByZXR1cm4gfVxyXG4gICAgICBmaWxlLmFzeW5jKCdzdHJpbmcnKS50aGVuKGZ1bmN0aW9uIChYTUxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgcGhyYXNlczogRWRpdGFibGVQaHJhc2VbXSA9IFtdXHJcbiAgICAgICAgcGFyc2VTdHJpbmcoWE1MQ29udGVudCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICBjb25zdCBwYXJhZ3JhcGhzID0gcmVzdWx0Wyd3OmRvY3VtZW50J11bJ3c6Ym9keSddWzBdWyd3OnAnXVxyXG4gICAgICAgICAgY29uc3QgZW50ZXIgPSAnXFxyXFxuJ1xyXG4gICAgICAgICAgbGV0IHBocmFzZTogRWRpdGFibGVQaHJhc2VcclxuXHJcbiAgICAgICAgICBwYXJhZ3JhcGhzLmZvckVhY2goKHBhcmFncmFwaDogeyBbeDogc3RyaW5nXTogeyBbeDogc3RyaW5nXTogYW55W107IH1bXTsgfSwgcGFyYWdyYXBoSW5kZXg6IG51bWJlcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgd1JMYWJlbHMgPSBwYXJhZ3JhcGhbJ3c6ciddXHJcbiAgICAgICAgICAgIGlmICghd1JMYWJlbHMgfHwgIXdSTGFiZWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHBocmFzZSA9IHsgdmFsdWU6IGVudGVyLCBwYXJhZ3JhcGhJbmRleCwgc2VudGVuc2VJbmRleDogMCB9XHJcbiAgICAgICAgICAgICAgcGhyYXNlcy5wdXNoKHBocmFzZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB3UkxhYmVscy5mb3JFYWNoKCh3UkxhYmVsOiB7IFt4OiBzdHJpbmddOiBhbnlbXTsgfSwgd1JMYWJlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dDogc3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBXVExhYmVsID0gd1JMYWJlbFsndzp0J11cclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIFdUTGFiZWwgaXMgYW4gb2JqZWN0IGFuZCBoYXMgdGhlIFwiX1wiIHByb3BlcnR5XHJcbiAgICAgICAgICAgICAgICBpZiAoV1RMYWJlbCAmJiBXVExhYmVsLmxlbmd0aCAmJiBXVExhYmVsWzBdWydfJ10pIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dCA9IFdUTGFiZWxbMF1bJ18nXVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKFdUTGFiZWwgJiYgV1RMYWJlbC5sZW5ndGggJiYgdHlwZW9mIFdUTGFiZWxbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFdUTGFiZWxbMF1cclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChXVExhYmVsICYmIFdUTGFiZWwubGVuZ3RoICYmIFdUTGFiZWxbMF1bJyQnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBcIiBcIlxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwaHJhc2UgPSB7IHZhbHVlOiB0ZXh0LCBwYXJhZ3JhcGhJbmRleCwgc2VudGVuc2VJbmRleDogd1JMYWJlbEluZGV4IH1cclxuICAgICAgICAgICAgICAgIHBocmFzZXMucHVzaChwaHJhc2UpXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgcmVzb2x2ZShwaHJhc2VzKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfSlcclxufSJdfQ==