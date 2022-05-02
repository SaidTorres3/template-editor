import * as JSZipImport from "jszip";
import { parseString } from "xml2js-preserve-spaces";
export const docxToString = async (docxFile) => {
    const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
    return new Promise((resolve, reject) => {
        // unzip the file
        const zip = new JSZip();
        zip.loadAsync(docxFile).then(function (zip) {
            // get the content of the document.xml file
            const wordFolder = zip.folder("word");
            if (!wordFolder) {
                reject(`An error ocurred attempting to enter to the folder 'word' of the docx file.`);
                return;
            }
            const file = wordFolder.file("document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async("string").then(function (XMLContent) {
                parseString(XMLContent, function (err, result) {
                    const paragraphs = result["w:document"]["w:body"][0]["w:p"];
                    let docxInTxt = "";
                    paragraphs.forEach((paragraph) => {
                        let textInTheParagraph = "";
                        const saveTheParagraph = () => {
                            textInTheParagraph += "\r\n";
                            docxInTxt += textInTheParagraph;
                        };
                        const WRLabel = paragraph["w:r"];
                        if (!WRLabel || !WRLabel.length) {
                            saveTheParagraph();
                            return;
                        }
                        WRLabel.forEach((WR) => {
                            let text = "";
                            const WTLabel = WR["w:t"];
                            // check if WTLabel is an object and has the "_" property
                            if (WTLabel && WTLabel.length && WTLabel[0]["_"]) {
                                text = WTLabel[0]["_"];
                            }
                            else {
                                if (WTLabel &&
                                    WTLabel.length &&
                                    typeof WTLabel[0] === "string") {
                                    text = WTLabel[0];
                                }
                                else {
                                    if (WTLabel && WTLabel.length && WTLabel[0]["$"]) {
                                        text = " ";
                                    }
                                }
                            }
                            textInTheParagraph += text;
                        });
                        saveTheParagraph();
                    });
                    resolve(docxInTxt);
                });
            });
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jeFRvU3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb1N0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssV0FBVyxNQUFNLE9BQU8sQ0FBQztBQUNyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHckQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFDL0IsUUFBeUIsRUFDUixFQUFFO0lBQ25CLE1BQU0sS0FBSyxHQUFHLE9BQU8sV0FBVyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxpQkFBaUI7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN4QixHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUc7WUFDeEMsMkNBQTJDO1lBQzNDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixNQUFNLENBQ0osNkVBQTZFLENBQzlFLENBQUM7Z0JBQ0YsT0FBTzthQUNSO1lBQ0QsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE1BQU0sQ0FDSiw2R0FBNkcsQ0FDOUcsQ0FBQztnQkFDRixPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLFVBQVU7Z0JBQzVDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxHQUFHLEVBQUUsTUFBTTtvQkFDM0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxJQUFJLFNBQVMsR0FBVyxFQUFFLENBQUM7b0JBRTNCLFVBQVUsQ0FBQyxPQUFPLENBQ2hCLENBQUMsU0FBb0QsRUFBRSxFQUFFO3dCQUN2RCxJQUFJLGtCQUFrQixHQUFXLEVBQUUsQ0FBQzt3QkFDcEMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7NEJBQzVCLGtCQUFrQixJQUFJLE1BQU0sQ0FBQzs0QkFDN0IsU0FBUyxJQUFJLGtCQUFrQixDQUFDO3dCQUNsQyxDQUFDLENBQUM7d0JBQ0YsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNqQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTs0QkFDL0IsZ0JBQWdCLEVBQUUsQ0FBQzs0QkFDbkIsT0FBTzt5QkFDUjt3QkFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBMEIsRUFBRSxFQUFFOzRCQUM3QyxJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7NEJBQ3RCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDMUIseURBQXlEOzRCQUN6RCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQ0FDaEQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDeEI7aUNBQU07Z0NBQ0wsSUFDRSxPQUFPO29DQUNQLE9BQU8sQ0FBQyxNQUFNO29DQUNkLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFDOUI7b0NBQ0EsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDbkI7cUNBQU07b0NBQ0wsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7d0NBQ2hELElBQUksR0FBRyxHQUFHLENBQUM7cUNBQ1o7aUNBQ0Y7NkJBQ0Y7NEJBQ0Qsa0JBQWtCLElBQUksSUFBSSxDQUFDO3dCQUM3QixDQUFDLENBQUMsQ0FBQzt3QkFDSCxnQkFBZ0IsRUFBRSxDQUFDO29CQUNyQixDQUFDLENBQ0YsQ0FBQztvQkFFRixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSlNaaXBJbXBvcnQgZnJvbSBcImpzemlwXCI7XHJcbmltcG9ydCB7IHBhcnNlU3RyaW5nIH0gZnJvbSBcInhtbDJqcy1wcmVzZXJ2ZS1zcGFjZXNcIjtcclxuaW1wb3J0IHsgSW5wdXRGaWxlRm9ybWF0IH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkb2N4VG9TdHJpbmcgPSBhc3luYyAoXHJcbiAgZG9jeEZpbGU6IElucHV0RmlsZUZvcm1hdFxyXG4pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gIGNvbnN0IEpTWmlwID0gdHlwZW9mIEpTWmlwSW1wb3J0ID09PSBcImZ1bmN0aW9uXCIgPyBKU1ppcEltcG9ydCA6IEpTWmlwSW1wb3J0W1wiZGVmYXVsdFwiXTtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgLy8gdW56aXAgdGhlIGZpbGVcclxuICAgIGNvbnN0IHppcCA9IG5ldyBKU1ppcCgpO1xyXG4gICAgemlwLmxvYWRBc3luYyhkb2N4RmlsZSkudGhlbihmdW5jdGlvbiAoemlwKSB7XHJcbiAgICAgIC8vIGdldCB0aGUgY29udGVudCBvZiB0aGUgZG9jdW1lbnQueG1sIGZpbGVcclxuICAgICAgY29uc3Qgd29yZEZvbGRlciA9IHppcC5mb2xkZXIoXCJ3b3JkXCIpO1xyXG4gICAgICBpZiAoIXdvcmRGb2xkZXIpIHtcclxuICAgICAgICByZWplY3QoXHJcbiAgICAgICAgICBgQW4gZXJyb3Igb2N1cnJlZCBhdHRlbXB0aW5nIHRvIGVudGVyIHRvIHRoZSBmb2xkZXIgJ3dvcmQnIG9mIHRoZSBkb2N4IGZpbGUuYFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGZpbGUgPSB3b3JkRm9sZGVyLmZpbGUoXCJkb2N1bWVudC54bWxcIik7XHJcbiAgICAgIGlmICghZmlsZSkge1xyXG4gICAgICAgIHJlamVjdChcclxuICAgICAgICAgIGBBbiBlcnJvciBvY3VycmVkIGF0dGVtcHRpbmcgdG8gZW50ZXIgdG8gdGhlIGxvYWQgdGhlIGZpbGUgJ2RvY3VtZW50LnhtbCcgaW4gZm9sZGVyICd3b3JkJyBvZiB0aGUgZG9jeCBmaWxlLmBcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBmaWxlLmFzeW5jKFwic3RyaW5nXCIpLnRoZW4oZnVuY3Rpb24gKFhNTENvbnRlbnQpIHtcclxuICAgICAgICBwYXJzZVN0cmluZyhYTUxDb250ZW50LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSByZXN1bHRbXCJ3OmRvY3VtZW50XCJdW1widzpib2R5XCJdWzBdW1widzpwXCJdO1xyXG4gICAgICAgICAgbGV0IGRvY3hJblR4dDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICBwYXJhZ3JhcGhzLmZvckVhY2goXHJcbiAgICAgICAgICAgIChwYXJhZ3JhcGg6IHsgW3g6IHN0cmluZ106IHsgW3g6IHN0cmluZ106IGFueVtdIH1bXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IHRleHRJblRoZVBhcmFncmFwaDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICBjb25zdCBzYXZlVGhlUGFyYWdyYXBoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGV4dEluVGhlUGFyYWdyYXBoICs9IFwiXFxyXFxuXCI7XHJcbiAgICAgICAgICAgICAgICBkb2N4SW5UeHQgKz0gdGV4dEluVGhlUGFyYWdyYXBoO1xyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgY29uc3QgV1JMYWJlbCA9IHBhcmFncmFwaFtcInc6clwiXTtcclxuICAgICAgICAgICAgICBpZiAoIVdSTGFiZWwgfHwgIVdSTGFiZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGhlUGFyYWdyYXBoKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFdSTGFiZWwuZm9yRWFjaCgoV1I6IHsgW3g6IHN0cmluZ106IGFueVtdIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgV1RMYWJlbCA9IFdSW1widzp0XCJdO1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgV1RMYWJlbCBpcyBhbiBvYmplY3QgYW5kIGhhcyB0aGUgXCJfXCIgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgIGlmIChXVExhYmVsICYmIFdUTGFiZWwubGVuZ3RoICYmIFdUTGFiZWxbMF1bXCJfXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQgPSBXVExhYmVsWzBdW1wiX1wiXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBXVExhYmVsICYmXHJcbiAgICAgICAgICAgICAgICAgICAgV1RMYWJlbC5sZW5ndGggJiZcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgV1RMYWJlbFswXSA9PT0gXCJzdHJpbmdcIlxyXG4gICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gV1RMYWJlbFswXTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoV1RMYWJlbCAmJiBXVExhYmVsLmxlbmd0aCAmJiBXVExhYmVsWzBdW1wiJFwiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGV4dEluVGhlUGFyYWdyYXBoICs9IHRleHQ7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgc2F2ZVRoZVBhcmFncmFwaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIHJlc29sdmUoZG9jeEluVHh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuIl19