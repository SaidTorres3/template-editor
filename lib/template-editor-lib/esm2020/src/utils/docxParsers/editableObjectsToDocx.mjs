import * as JSZip from 'jszip';
import xml2js from 'xml2js-preserve-spaces';
export const editableObjectToDocx = async (opts) => {
    return new Promise((resolve, reject) => {
        // unzip the file
        const zipHandler = new JSZip();
        zipHandler.loadAsync(opts.fileIn).then(function (zipContent) {
            const file = zipContent.file("word/document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async('text').then(function (XMLContent) {
                xml2js.parseString(XMLContent, function (err, result) {
                    const paragraphs = result['w:document']['w:body'][0]['w:p'];
                    paragraphs.forEach((paragraph, paragraphIndex) => {
                        const wRLabels = paragraph['w:r'];
                        if (!wRLabels || !wRLabels.length) {
                            return paragraph;
                        }
                        wRLabels.forEach((wRLabel, wRLabelIndex) => {
                            const modfiedPhrase = getModifiedPhrase(opts.modifiedObjects, { paragraphIndex, sentenseIndex: wRLabelIndex });
                            if (!modfiedPhrase) {
                                return paragraph;
                            }
                            // check if WTLabel is an object and has the "_" property
                            if (wRLabel['w:t'] && wRLabel['w:t'].length && wRLabel['w:t'][0]['_']) {
                                wRLabel['w:t'][0]['_'] = modfiedPhrase.value;
                            }
                            else {
                                if (wRLabel['w:t'] && wRLabel['w:t'].length && typeof wRLabel['w:t'][0] === 'string') {
                                    wRLabel['w:t'][0] = modfiedPhrase.value;
                                }
                            }
                        });
                    });
                    const modifiedXML = new xml2js.Builder().buildObject(result);
                    // replace 'file' variable with modifiedXML
                    zipContent.file('word/document.xml', modifiedXML);
                    zipContent.generateAsync({ type: 'blob' }).then(function (outputFile) {
                        resolve(outputFile);
                    });
                });
            });
        });
    });
};
const getModifiedPhrase = (phrases, phaseCoords) => {
    const phrase = phrases.find((phrase) => {
        if (phrase.paragraphIndex === phaseCoords.paragraphIndex && phrase.sentenseIndex === phaseCoords.sentenseIndex) {
            return phrase;
        }
    });
    return phrase;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGVPYmplY3RzVG9Eb2N4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2VkaXRhYmxlT2JqZWN0c1RvRG9jeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUM5QixPQUFPLE1BQU0sTUFBTSx3QkFBd0IsQ0FBQTtBQUczQyxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLEVBQUUsSUFBOEIsRUFBaUIsRUFBRTtJQUMxRixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQy9CLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLFVBQVU7WUFDekQsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQ2pELElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLDZHQUE2RyxDQUFDLENBQUM7Z0JBQUMsT0FBTTthQUFFO1lBRTVJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsVUFBVTtnQkFDMUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLEVBQUUsTUFBTTtvQkFDbEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUMzRCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBc0QsRUFBRSxjQUFzQixFQUFFLEVBQUU7d0JBQ3BHLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDakMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7NEJBQUUsT0FBTyxTQUFTLENBQUE7eUJBQUU7d0JBQ3ZELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFnQyxFQUFFLFlBQVksRUFBRSxFQUFFOzRCQUNsRSxNQUFNLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFBOzRCQUM5RyxJQUFJLENBQUMsYUFBYSxFQUFFO2dDQUFFLE9BQU8sU0FBUyxDQUFBOzZCQUFFOzRCQUN4Qyx5REFBeUQ7NEJBQ3pELElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dDQUNyRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQTs2QkFDN0M7aUNBQU07Z0NBQ0wsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7b0NBQ3BGLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFBO2lDQUN4Qzs2QkFDRjt3QkFDSCxDQUFDLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsQ0FBQTtvQkFDRixNQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQzVELDJDQUEyQztvQkFDM0MsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FBQTtvQkFDakQsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLFVBQVU7d0JBQ2xFLE9BQU8sQ0FBQyxVQUFrQixDQUFDLENBQUE7b0JBQzdCLENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE9BQXlCLEVBQUUsV0FBeUIsRUFBOEIsRUFBRTtJQUM3RyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBc0IsRUFBRSxFQUFFO1FBQ3JELElBQUksTUFBTSxDQUFDLGNBQWMsS0FBSyxXQUFXLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEtBQUssV0FBVyxDQUFDLGFBQWEsRUFBRTtZQUM5RyxPQUFPLE1BQU0sQ0FBQTtTQUNkO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLE1BQU0sQ0FBQTtBQUNmLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEpTWmlwIGZyb20gJ2pzemlwJ1xyXG5pbXBvcnQgeG1sMmpzIGZyb20gJ3htbDJqcy1wcmVzZXJ2ZS1zcGFjZXMnXHJcbmltcG9ydCB7IEVkaXRhYmxlT2JqZWN0VG9Eb2N4T3B0cywgRWRpdGFibGVQaHJhc2UsIFBocmFzZUNvb3JkcyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVkaXRhYmxlT2JqZWN0VG9Eb2N4ID0gYXN5bmMgKG9wdHM6IEVkaXRhYmxlT2JqZWN0VG9Eb2N4T3B0cyk6IFByb21pc2U8RmlsZT4gPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyB1bnppcCB0aGUgZmlsZVxyXG4gICAgY29uc3QgemlwSGFuZGxlciA9IG5ldyBKU1ppcCgpO1xyXG4gICAgemlwSGFuZGxlci5sb2FkQXN5bmMob3B0cy5maWxlSW4pLnRoZW4oZnVuY3Rpb24gKHppcENvbnRlbnQpIHtcclxuICAgICAgY29uc3QgZmlsZSA9IHppcENvbnRlbnQuZmlsZShcIndvcmQvZG9jdW1lbnQueG1sXCIpXHJcbiAgICAgIGlmICghZmlsZSkgeyByZWplY3QoYEFuIGVycm9yIG9jdXJyZWQgYXR0ZW1wdGluZyB0byBlbnRlciB0byB0aGUgbG9hZCB0aGUgZmlsZSAnZG9jdW1lbnQueG1sJyBpbiBmb2xkZXIgJ3dvcmQnIG9mIHRoZSBkb2N4IGZpbGUuYCk7IHJldHVybiB9XHJcblxyXG4gICAgICBmaWxlLmFzeW5jKCd0ZXh0JykudGhlbihmdW5jdGlvbiAoWE1MQ29udGVudCkge1xyXG4gICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhYTUxDb250ZW50LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSByZXN1bHRbJ3c6ZG9jdW1lbnQnXVsndzpib2R5J11bMF1bJ3c6cCddXHJcbiAgICAgICAgICBwYXJhZ3JhcGhzLmZvckVhY2goKHBhcmFncmFwaDogeyBbeDogc3RyaW5nXTogeyBbeDogc3RyaW5nXTogYW55W107IH1bXTsgfSwgcGFyYWdyYXBoSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3UkxhYmVscyA9IHBhcmFncmFwaFsndzpyJ11cclxuICAgICAgICAgICAgaWYgKCF3UkxhYmVscyB8fCAhd1JMYWJlbHMubGVuZ3RoKSB7IHJldHVybiBwYXJhZ3JhcGggfVxyXG4gICAgICAgICAgICB3UkxhYmVscy5mb3JFYWNoKCh3UkxhYmVsOiB7IFt4OiBzdHJpbmddOiBhbnlbXTsgfSwgd1JMYWJlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbW9kZmllZFBocmFzZSA9IGdldE1vZGlmaWVkUGhyYXNlKG9wdHMubW9kaWZpZWRPYmplY3RzLCB7IHBhcmFncmFwaEluZGV4LCBzZW50ZW5zZUluZGV4OiB3UkxhYmVsSW5kZXggfSlcclxuICAgICAgICAgICAgICBpZiAoIW1vZGZpZWRQaHJhc2UpIHsgcmV0dXJuIHBhcmFncmFwaCB9XHJcbiAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgV1RMYWJlbCBpcyBhbiBvYmplY3QgYW5kIGhhcyB0aGUgXCJfXCIgcHJvcGVydHlcclxuICAgICAgICAgICAgICBpZiAod1JMYWJlbFsndzp0J10gJiYgd1JMYWJlbFsndzp0J10ubGVuZ3RoICYmIHdSTGFiZWxbJ3c6dCddWzBdWydfJ10pIHtcclxuICAgICAgICAgICAgICAgIHdSTGFiZWxbJ3c6dCddWzBdWydfJ10gPSBtb2RmaWVkUGhyYXNlLnZhbHVlXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh3UkxhYmVsWyd3OnQnXSAmJiB3UkxhYmVsWyd3OnQnXS5sZW5ndGggJiYgdHlwZW9mIHdSTGFiZWxbJ3c6dCddWzBdID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICB3UkxhYmVsWyd3OnQnXVswXSA9IG1vZGZpZWRQaHJhc2UudmFsdWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgY29uc3QgbW9kaWZpZWRYTUwgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKS5idWlsZE9iamVjdChyZXN1bHQpXHJcbiAgICAgICAgICAvLyByZXBsYWNlICdmaWxlJyB2YXJpYWJsZSB3aXRoIG1vZGlmaWVkWE1MXHJcbiAgICAgICAgICB6aXBDb250ZW50LmZpbGUoJ3dvcmQvZG9jdW1lbnQueG1sJywgbW9kaWZpZWRYTUwpXHJcbiAgICAgICAgICB6aXBDb250ZW50LmdlbmVyYXRlQXN5bmMoeyB0eXBlOiAnYmxvYicgfSkudGhlbihmdW5jdGlvbiAob3V0cHV0RmlsZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKG91dHB1dEZpbGUgYXMgRmlsZSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9KVxyXG59XHJcblxyXG5jb25zdCBnZXRNb2RpZmllZFBocmFzZSA9IChwaHJhc2VzOiBFZGl0YWJsZVBocmFzZVtdLCBwaGFzZUNvb3JkczogUGhyYXNlQ29vcmRzKTogRWRpdGFibGVQaHJhc2UgfCB1bmRlZmluZWQgPT4ge1xyXG4gIGNvbnN0IHBocmFzZSA9IHBocmFzZXMuZmluZCgocGhyYXNlOiBFZGl0YWJsZVBocmFzZSkgPT4ge1xyXG4gICAgaWYgKHBocmFzZS5wYXJhZ3JhcGhJbmRleCA9PT0gcGhhc2VDb29yZHMucGFyYWdyYXBoSW5kZXggJiYgcGhyYXNlLnNlbnRlbnNlSW5kZXggPT09IHBoYXNlQ29vcmRzLnNlbnRlbnNlSW5kZXgpIHtcclxuICAgICAgcmV0dXJuIHBocmFzZVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgcmV0dXJuIHBocmFzZVxyXG59Il19