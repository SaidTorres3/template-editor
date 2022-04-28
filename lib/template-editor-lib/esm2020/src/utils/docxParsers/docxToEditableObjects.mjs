import * as JSZip from 'jszip';
import { parseString } from 'xml2js-preserve-spaces';
export const docxToEditableObjects = async (docxFile) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jeFRvRWRpdGFibGVPYmplY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb0VkaXRhYmxlT2JqZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUM5QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFHcEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxFQUFFLFFBQXlCLEVBQTZCLEVBQUU7SUFDbEcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxpQkFBaUI7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN4QixHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUc7WUFDeEMsMkNBQTJDO1lBQzNDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDckMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFBRSxNQUFNLENBQUMsNkVBQTZFLENBQUMsQ0FBQztnQkFBQyxPQUFNO2FBQUU7WUFDbEgsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUFFLE1BQU0sQ0FBQyw2R0FBNkcsQ0FBQyxDQUFDO2dCQUFDLE9BQU07YUFBRTtZQUM1SSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLFVBQVU7Z0JBQzVDLE1BQU0sT0FBTyxHQUFxQixFQUFFLENBQUE7Z0JBQ3BDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLEVBQUUsTUFBTTtvQkFDM0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUMzRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUE7b0JBQ3BCLElBQUksTUFBc0IsQ0FBQTtvQkFFMUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQXNELEVBQUUsY0FBc0IsRUFBRSxFQUFFO3dCQUVwRyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7d0JBQ2pDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFOzRCQUNqQyxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUE7NEJBQzNELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7eUJBQ3JCOzZCQUFNOzRCQUNMLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFnQyxFQUFFLFlBQVksRUFBRSxFQUFFO2dDQUNsRSxJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7Z0NBQ3RCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQ0FDOUIseURBQXlEO2dDQUN6RCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQ0FDaEQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQ0FDdkI7cUNBQU07b0NBQ0wsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7d0NBQy9ELElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7cUNBQ2xCO3lDQUFNLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dDQUN2RCxJQUFJLEdBQUcsR0FBRyxDQUFBO3FDQUNYO2lDQUNGO2dDQUNELE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsQ0FBQTtnQ0FDckUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTs0QkFDdEIsQ0FBQyxDQUFDLENBQUE7eUJBQ0g7b0JBRUgsQ0FBQyxDQUFDLENBQUE7b0JBRUYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNsQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEpTWmlwIGZyb20gJ2pzemlwJ1xyXG5pbXBvcnQgeyBwYXJzZVN0cmluZyB9IGZyb20gJ3htbDJqcy1wcmVzZXJ2ZS1zcGFjZXMnXHJcbmltcG9ydCB7IElucHV0RmlsZUZvcm1hdCwgRWRpdGFibGVQaHJhc2UgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBkb2N4VG9FZGl0YWJsZU9iamVjdHMgPSBhc3luYyAoZG9jeEZpbGU6IElucHV0RmlsZUZvcm1hdCk6IFByb21pc2U8RWRpdGFibGVQaHJhc2VbXT4gPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyB1bnppcCB0aGUgZmlsZVxyXG4gICAgY29uc3QgemlwID0gbmV3IEpTWmlwKCk7XHJcbiAgICB6aXAubG9hZEFzeW5jKGRvY3hGaWxlKS50aGVuKGZ1bmN0aW9uICh6aXApIHtcclxuICAgICAgLy8gZ2V0IHRoZSBjb250ZW50IG9mIHRoZSBkb2N1bWVudC54bWwgZmlsZVxyXG4gICAgICBjb25zdCB3b3JkRm9sZGVyID0gemlwLmZvbGRlcignd29yZCcpXHJcbiAgICAgIGlmICghd29yZEZvbGRlcikgeyByZWplY3QoYEFuIGVycm9yIG9jdXJyZWQgYXR0ZW1wdGluZyB0byBlbnRlciB0byB0aGUgZm9sZGVyICd3b3JkJyBvZiB0aGUgZG9jeCBmaWxlLmApOyByZXR1cm4gfVxyXG4gICAgICBjb25zdCBmaWxlID0gd29yZEZvbGRlci5maWxlKFwiZG9jdW1lbnQueG1sXCIpXHJcbiAgICAgIGlmICghZmlsZSkgeyByZWplY3QoYEFuIGVycm9yIG9jdXJyZWQgYXR0ZW1wdGluZyB0byBlbnRlciB0byB0aGUgbG9hZCB0aGUgZmlsZSAnZG9jdW1lbnQueG1sJyBpbiBmb2xkZXIgJ3dvcmQnIG9mIHRoZSBkb2N4IGZpbGUuYCk7IHJldHVybiB9XHJcbiAgICAgIGZpbGUuYXN5bmMoJ3N0cmluZycpLnRoZW4oZnVuY3Rpb24gKFhNTENvbnRlbnQpIHtcclxuICAgICAgICBjb25zdCBwaHJhc2VzOiBFZGl0YWJsZVBocmFzZVtdID0gW11cclxuICAgICAgICBwYXJzZVN0cmluZyhYTUxDb250ZW50LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSByZXN1bHRbJ3c6ZG9jdW1lbnQnXVsndzpib2R5J11bMF1bJ3c6cCddXHJcbiAgICAgICAgICBjb25zdCBlbnRlciA9ICdcXHJcXG4nXHJcbiAgICAgICAgICBsZXQgcGhyYXNlOiBFZGl0YWJsZVBocmFzZVxyXG5cclxuICAgICAgICAgIHBhcmFncmFwaHMuZm9yRWFjaCgocGFyYWdyYXBoOiB7IFt4OiBzdHJpbmddOiB7IFt4OiBzdHJpbmddOiBhbnlbXTsgfVtdOyB9LCBwYXJhZ3JhcGhJbmRleDogbnVtYmVyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3UkxhYmVscyA9IHBhcmFncmFwaFsndzpyJ11cclxuICAgICAgICAgICAgaWYgKCF3UkxhYmVscyB8fCAhd1JMYWJlbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgcGhyYXNlID0geyB2YWx1ZTogZW50ZXIsIHBhcmFncmFwaEluZGV4LCBzZW50ZW5zZUluZGV4OiAwIH1cclxuICAgICAgICAgICAgICBwaHJhc2VzLnB1c2gocGhyYXNlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdSTGFiZWxzLmZvckVhY2goKHdSTGFiZWw6IHsgW3g6IHN0cmluZ106IGFueVtdOyB9LCB3UkxhYmVsSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgIGNvbnN0IFdUTGFiZWwgPSB3UkxhYmVsWyd3OnQnXVxyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgV1RMYWJlbCBpcyBhbiBvYmplY3QgYW5kIGhhcyB0aGUgXCJfXCIgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgIGlmIChXVExhYmVsICYmIFdUTGFiZWwubGVuZ3RoICYmIFdUTGFiZWxbMF1bJ18nXSkge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0ID0gV1RMYWJlbFswXVsnXyddXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoV1RMYWJlbCAmJiBXVExhYmVsLmxlbmd0aCAmJiB0eXBlb2YgV1RMYWJlbFswXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gV1RMYWJlbFswXVxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFdUTGFiZWwgJiYgV1RMYWJlbC5sZW5ndGggJiYgV1RMYWJlbFswXVsnJCddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwiIFwiXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBocmFzZSA9IHsgdmFsdWU6IHRleHQsIHBhcmFncmFwaEluZGV4LCBzZW50ZW5zZUluZGV4OiB3UkxhYmVsSW5kZXggfVxyXG4gICAgICAgICAgICAgICAgcGhyYXNlcy5wdXNoKHBocmFzZSlcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICByZXNvbHZlKHBocmFzZXMpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9KVxyXG59Il19