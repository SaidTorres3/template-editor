import * as JSZipImport from "jszip";
import { parseString } from 'xml2js-preserve-spaces';
export const docxToEditableObjects = async (docxFile) => {
    const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
    return new Promise((resolve, reject) => {
        // unzip the file
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jeFRvRWRpdGFibGVPYmplY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb0VkaXRhYmxlT2JqZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssV0FBVyxNQUFNLE9BQU8sQ0FBQztBQUNyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFHcEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxFQUFFLFFBQXlCLEVBQTZCLEVBQUU7SUFDbEcsTUFBTSxLQUFLLEdBQUcsT0FBTyxXQUFXLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLGlCQUFpQjtRQUNqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRztZQUN4QywyQ0FBMkM7WUFDM0MsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNyQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUFFLE1BQU0sQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDO2dCQUFDLE9BQU07YUFBRTtZQUNsSCxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQzVDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLDZHQUE2RyxDQUFDLENBQUM7Z0JBQUMsT0FBTTthQUFFO1lBQzVJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsVUFBVTtnQkFDNUMsTUFBTSxPQUFPLEdBQXFCLEVBQUUsQ0FBQTtnQkFDcEMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO29CQUMzQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQzNELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQTtvQkFDcEIsSUFBSSxNQUFzQixDQUFBO29CQUUxQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBc0QsRUFBRSxjQUFzQixFQUFFLEVBQUU7d0JBRXBHLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDakMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7NEJBQ2pDLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQTs0QkFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTt5QkFDckI7NkJBQU07NEJBQ0wsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWdDLEVBQUUsWUFBWSxFQUFFLEVBQUU7Z0NBQ2xFLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztnQ0FDdEIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUM5Qix5REFBeUQ7Z0NBQ3pELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29DQUNoRCxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lDQUN2QjtxQ0FBTTtvQ0FDTCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTt3Q0FDL0QsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtxQ0FDbEI7eUNBQU0sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7d0NBQ3ZELElBQUksR0FBRyxHQUFHLENBQUE7cUNBQ1g7aUNBQ0Y7Z0NBQ0QsTUFBTSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxDQUFBO2dDQUNyRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBOzRCQUN0QixDQUFDLENBQUMsQ0FBQTt5QkFDSDtvQkFFSCxDQUFDLENBQUMsQ0FBQTtvQkFFRixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSlNaaXBJbXBvcnQgZnJvbSBcImpzemlwXCI7XHJcbmltcG9ydCB7IHBhcnNlU3RyaW5nIH0gZnJvbSAneG1sMmpzLXByZXNlcnZlLXNwYWNlcydcclxuaW1wb3J0IHsgSW5wdXRGaWxlRm9ybWF0LCBFZGl0YWJsZVBocmFzZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRvY3hUb0VkaXRhYmxlT2JqZWN0cyA9IGFzeW5jIChkb2N4RmlsZTogSW5wdXRGaWxlRm9ybWF0KTogUHJvbWlzZTxFZGl0YWJsZVBocmFzZVtdPiA9PiB7XHJcbiAgY29uc3QgSlNaaXAgPSB0eXBlb2YgSlNaaXBJbXBvcnQgPT09IFwiZnVuY3Rpb25cIiA/IEpTWmlwSW1wb3J0IDogSlNaaXBJbXBvcnRbXCJkZWZhdWx0XCJdO1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyB1bnppcCB0aGUgZmlsZVxyXG4gICAgY29uc3QgemlwID0gbmV3IEpTWmlwKCk7XHJcbiAgICB6aXAubG9hZEFzeW5jKGRvY3hGaWxlKS50aGVuKGZ1bmN0aW9uICh6aXApIHtcclxuICAgICAgLy8gZ2V0IHRoZSBjb250ZW50IG9mIHRoZSBkb2N1bWVudC54bWwgZmlsZVxyXG4gICAgICBjb25zdCB3b3JkRm9sZGVyID0gemlwLmZvbGRlcignd29yZCcpXHJcbiAgICAgIGlmICghd29yZEZvbGRlcikgeyByZWplY3QoYEFuIGVycm9yIG9jdXJyZWQgYXR0ZW1wdGluZyB0byBlbnRlciB0byB0aGUgZm9sZGVyICd3b3JkJyBvZiB0aGUgZG9jeCBmaWxlLmApOyByZXR1cm4gfVxyXG4gICAgICBjb25zdCBmaWxlID0gd29yZEZvbGRlci5maWxlKFwiZG9jdW1lbnQueG1sXCIpXHJcbiAgICAgIGlmICghZmlsZSkgeyByZWplY3QoYEFuIGVycm9yIG9jdXJyZWQgYXR0ZW1wdGluZyB0byBlbnRlciB0byB0aGUgbG9hZCB0aGUgZmlsZSAnZG9jdW1lbnQueG1sJyBpbiBmb2xkZXIgJ3dvcmQnIG9mIHRoZSBkb2N4IGZpbGUuYCk7IHJldHVybiB9XHJcbiAgICAgIGZpbGUuYXN5bmMoJ3N0cmluZycpLnRoZW4oZnVuY3Rpb24gKFhNTENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBwaHJhc2VzOiBFZGl0YWJsZVBocmFzZVtdID0gW11cclxuICAgICAgICBwYXJzZVN0cmluZyhYTUxDb250ZW50LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSByZXN1bHRbJ3c6ZG9jdW1lbnQnXVsndzpib2R5J11bMF1bJ3c6cCddXHJcbiAgICAgICAgICBjb25zdCBlbnRlciA9ICdcXHJcXG4nXHJcbiAgICAgICAgICBsZXQgcGhyYXNlOiBFZGl0YWJsZVBocmFzZVxyXG5cclxuICAgICAgICAgIHBhcmFncmFwaHMuZm9yRWFjaCgocGFyYWdyYXBoOiB7IFt4OiBzdHJpbmddOiB7IFt4OiBzdHJpbmddOiBhbnlbXTsgfVtdOyB9LCBwYXJhZ3JhcGhJbmRleDogbnVtYmVyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3UkxhYmVscyA9IHBhcmFncmFwaFsndzpyJ11cclxuICAgICAgICAgICAgaWYgKCF3UkxhYmVscyB8fCAhd1JMYWJlbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgcGhyYXNlID0geyB2YWx1ZTogZW50ZXIsIHBhcmFncmFwaEluZGV4LCBzZW50ZW5zZUluZGV4OiAwIH1cclxuICAgICAgICAgICAgICBwaHJhc2VzLnB1c2gocGhyYXNlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdSTGFiZWxzLmZvckVhY2goKHdSTGFiZWw6IHsgW3g6IHN0cmluZ106IGFueVtdOyB9LCB3UkxhYmVsSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgIGNvbnN0IFdUTGFiZWwgPSB3UkxhYmVsWyd3OnQnXVxyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgV1RMYWJlbCBpcyBhbiBvYmplY3QgYW5kIGhhcyB0aGUgXCJfXCIgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgIGlmIChXVExhYmVsICYmIFdUTGFiZWwubGVuZ3RoICYmIFdUTGFiZWxbMF1bJ18nXSkge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0ID0gV1RMYWJlbFswXVsnXyddXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoV1RMYWJlbCAmJiBXVExhYmVsLmxlbmd0aCAmJiB0eXBlb2YgV1RMYWJlbFswXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gV1RMYWJlbFswXVxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFdUTGFiZWwgJiYgV1RMYWJlbC5sZW5ndGggJiYgV1RMYWJlbFswXVsnJCddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwiIFwiXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBocmFzZSA9IHsgdmFsdWU6IHRleHQsIHBhcmFncmFwaEluZGV4LCBzZW50ZW5zZUluZGV4OiB3UkxhYmVsSW5kZXggfVxyXG4gICAgICAgICAgICAgICAgcGhyYXNlcy5wdXNoKHBocmFzZSlcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICByZXNvbHZlKHBocmFzZXMpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9KVxyXG59Il19