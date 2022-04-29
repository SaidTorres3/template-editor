import * as JSZip from 'jszip';
import { parseString } from 'xml2js-preserve-spaces';
export const docxToEditableObjects = async (docxFile) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jeFRvRWRpdGFibGVPYmplY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb0VkaXRhYmxlT2JqZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUM5QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFHcEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxFQUFFLFFBQXlCLEVBQTZCLEVBQUU7SUFDbEcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxpQkFBaUI7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNsQixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRztZQUN4QywyQ0FBMkM7WUFDM0MsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNyQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUFFLE1BQU0sQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDO2dCQUFDLE9BQU07YUFBRTtZQUNsSCxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQzVDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLDZHQUE2RyxDQUFDLENBQUM7Z0JBQUMsT0FBTTthQUFFO1lBQzVJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsVUFBVTtnQkFDNUMsTUFBTSxPQUFPLEdBQXFCLEVBQUUsQ0FBQTtnQkFDcEMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO29CQUMzQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQzNELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQTtvQkFDcEIsSUFBSSxNQUFzQixDQUFBO29CQUUxQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBc0QsRUFBRSxjQUFzQixFQUFFLEVBQUU7d0JBRXBHLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDakMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7NEJBQ2pDLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQTs0QkFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTt5QkFDckI7NkJBQU07NEJBQ0wsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWdDLEVBQUUsWUFBWSxFQUFFLEVBQUU7Z0NBQ2xFLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztnQ0FDdEIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUM5Qix5REFBeUQ7Z0NBQ3pELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29DQUNoRCxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lDQUN2QjtxQ0FBTTtvQ0FDTCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTt3Q0FDL0QsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtxQ0FDbEI7eUNBQU0sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7d0NBQ3ZELElBQUksR0FBRyxHQUFHLENBQUE7cUNBQ1g7aUNBQ0Y7Z0NBQ0QsTUFBTSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxDQUFBO2dDQUNyRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBOzRCQUN0QixDQUFDLENBQUMsQ0FBQTt5QkFDSDtvQkFFSCxDQUFDLENBQUMsQ0FBQTtvQkFFRixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSlNaaXAgZnJvbSAnanN6aXAnXHJcbmltcG9ydCB7IHBhcnNlU3RyaW5nIH0gZnJvbSAneG1sMmpzLXByZXNlcnZlLXNwYWNlcydcclxuaW1wb3J0IHsgSW5wdXRGaWxlRm9ybWF0LCBFZGl0YWJsZVBocmFzZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRvY3hUb0VkaXRhYmxlT2JqZWN0cyA9IGFzeW5jIChkb2N4RmlsZTogSW5wdXRGaWxlRm9ybWF0KTogUHJvbWlzZTxFZGl0YWJsZVBocmFzZVtdPiA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIC8vIHVuemlwIHRoZSBmaWxlXHJcbiAgICBjb25zb2xlLmxvZyhKU1ppcClcclxuICAgIGNvbnN0IHppcCA9IG5ldyBKU1ppcCgpO1xyXG4gICAgemlwLmxvYWRBc3luYyhkb2N4RmlsZSkudGhlbihmdW5jdGlvbiAoemlwKSB7XHJcbiAgICAgIC8vIGdldCB0aGUgY29udGVudCBvZiB0aGUgZG9jdW1lbnQueG1sIGZpbGVcclxuICAgICAgY29uc3Qgd29yZEZvbGRlciA9IHppcC5mb2xkZXIoJ3dvcmQnKVxyXG4gICAgICBpZiAoIXdvcmRGb2xkZXIpIHsgcmVqZWN0KGBBbiBlcnJvciBvY3VycmVkIGF0dGVtcHRpbmcgdG8gZW50ZXIgdG8gdGhlIGZvbGRlciAnd29yZCcgb2YgdGhlIGRvY3ggZmlsZS5gKTsgcmV0dXJuIH1cclxuICAgICAgY29uc3QgZmlsZSA9IHdvcmRGb2xkZXIuZmlsZShcImRvY3VtZW50LnhtbFwiKVxyXG4gICAgICBpZiAoIWZpbGUpIHsgcmVqZWN0KGBBbiBlcnJvciBvY3VycmVkIGF0dGVtcHRpbmcgdG8gZW50ZXIgdG8gdGhlIGxvYWQgdGhlIGZpbGUgJ2RvY3VtZW50LnhtbCcgaW4gZm9sZGVyICd3b3JkJyBvZiB0aGUgZG9jeCBmaWxlLmApOyByZXR1cm4gfVxyXG4gICAgICBmaWxlLmFzeW5jKCdzdHJpbmcnKS50aGVuKGZ1bmN0aW9uIChYTUxDb250ZW50KSB7XHJcbiAgICAgICAgY29uc3QgcGhyYXNlczogRWRpdGFibGVQaHJhc2VbXSA9IFtdXHJcbiAgICAgICAgcGFyc2VTdHJpbmcoWE1MQ29udGVudCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICBjb25zdCBwYXJhZ3JhcGhzID0gcmVzdWx0Wyd3OmRvY3VtZW50J11bJ3c6Ym9keSddWzBdWyd3OnAnXVxyXG4gICAgICAgICAgY29uc3QgZW50ZXIgPSAnXFxyXFxuJ1xyXG4gICAgICAgICAgbGV0IHBocmFzZTogRWRpdGFibGVQaHJhc2VcclxuXHJcbiAgICAgICAgICBwYXJhZ3JhcGhzLmZvckVhY2goKHBhcmFncmFwaDogeyBbeDogc3RyaW5nXTogeyBbeDogc3RyaW5nXTogYW55W107IH1bXTsgfSwgcGFyYWdyYXBoSW5kZXg6IG51bWJlcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgd1JMYWJlbHMgPSBwYXJhZ3JhcGhbJ3c6ciddXHJcbiAgICAgICAgICAgIGlmICghd1JMYWJlbHMgfHwgIXdSTGFiZWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHBocmFzZSA9IHsgdmFsdWU6IGVudGVyLCBwYXJhZ3JhcGhJbmRleCwgc2VudGVuc2VJbmRleDogMCB9XHJcbiAgICAgICAgICAgICAgcGhyYXNlcy5wdXNoKHBocmFzZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB3UkxhYmVscy5mb3JFYWNoKCh3UkxhYmVsOiB7IFt4OiBzdHJpbmddOiBhbnlbXTsgfSwgd1JMYWJlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dDogc3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBXVExhYmVsID0gd1JMYWJlbFsndzp0J11cclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIFdUTGFiZWwgaXMgYW4gb2JqZWN0IGFuZCBoYXMgdGhlIFwiX1wiIHByb3BlcnR5XHJcbiAgICAgICAgICAgICAgICBpZiAoV1RMYWJlbCAmJiBXVExhYmVsLmxlbmd0aCAmJiBXVExhYmVsWzBdWydfJ10pIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dCA9IFdUTGFiZWxbMF1bJ18nXVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKFdUTGFiZWwgJiYgV1RMYWJlbC5sZW5ndGggJiYgdHlwZW9mIFdUTGFiZWxbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFdUTGFiZWxbMF1cclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChXVExhYmVsICYmIFdUTGFiZWwubGVuZ3RoICYmIFdUTGFiZWxbMF1bJyQnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBcIiBcIlxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwaHJhc2UgPSB7IHZhbHVlOiB0ZXh0LCBwYXJhZ3JhcGhJbmRleCwgc2VudGVuc2VJbmRleDogd1JMYWJlbEluZGV4IH1cclxuICAgICAgICAgICAgICAgIHBocmFzZXMucHVzaChwaHJhc2UpXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgcmVzb2x2ZShwaHJhc2VzKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfSlcclxufSJdfQ==