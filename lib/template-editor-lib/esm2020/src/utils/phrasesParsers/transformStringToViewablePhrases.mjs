import { ViewablePhraseType } from "../docxParsers/types";
export const transformStringToViewablePhrases = (opts) => {
    const startsAndEnds = [];
    let requirementsToCloseTag = { amountOfClosingTags: 0, type: undefined };
    let startingTagPosition = 0;
    let closingTagPosition = -1;
    // sort tags by priority, lower priority first
    opts.tags.sort((a, b) => { return a.priority - b.priority; });
    for (let i = 0; i < opts.text.length; i++) {
        for (let j = 0; j < opts.tags.length; j++) {
            const { startTag, closeTag, type: tagType } = opts.tags[j];
            const isStartingATag = opts.text.substring(i, i + startTag.length) === startTag;
            const isEndingAnTag = opts.text.substring(i, i + closeTag.length) === closeTag;
            const isTheLastCharacter = i === opts.text.length - 1;
            if ((isTheLastCharacter) && (i != closingTagPosition)) {
                const isThereText = (i - closingTagPosition) > 0;
                isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null;
                break;
            }
            if (isStartingATag && ((!requirementsToCloseTag.amountOfClosingTags) || (requirementsToCloseTag.type === tagType))) {
                if (!requirementsToCloseTag.amountOfClosingTags) {
                    const isThereText = (i - closingTagPosition) > 0;
                    isThereText ? startsAndEnds.push({ start: closingTagPosition, end: i, type: ViewablePhraseType.text }) : null;
                    startingTagPosition = i;
                }
                requirementsToCloseTag = { amountOfClosingTags: requirementsToCloseTag.amountOfClosingTags + 1, type: opts.tags[j].type };
                break;
            }
            else if ((isEndingAnTag) && (tagType == requirementsToCloseTag.type)) {
                requirementsToCloseTag.amountOfClosingTags--;
                if (requirementsToCloseTag.amountOfClosingTags == 0) {
                    closingTagPosition = i + closeTag.length;
                    startsAndEnds.push({ start: startingTagPosition, end: closingTagPosition, type: opts.tags[j].type });
                }
                break;
            }
        }
    }
    startsAndEnds.sort((a, b) => a.start - b.start);
    let viewablePhrases = [];
    startsAndEnds.forEach(a => {
        viewablePhrases.push({
            value: opts.text.substring(a.start, a.end),
            type: a.type
        });
    });
    return viewablePhrases;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtU3RyaW5nVG9WaWV3YWJsZVBocmFzZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdXRpbHMvcGhyYXNlc1BhcnNlcnMvdHJhbnNmb3JtU3RyaW5nVG9WaWV3YWJsZVBocmFzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFrQixrQkFBa0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRzFFLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHLENBQUMsSUFBa0IsRUFBb0IsRUFBRTtJQUN2RixNQUFNLGFBQWEsR0FBMEIsRUFBRSxDQUFBO0lBQy9DLElBQUksc0JBQXNCLEdBQTBFLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoSixJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVCLDhDQUE4QztJQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLENBQUE7WUFDL0UsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxDQUFBO1lBQzlFLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtZQUVyRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxFQUFFO2dCQUNyRCxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDaEQsV0FBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtnQkFDN0csTUFBTTthQUNQO1lBRUQsSUFBSSxjQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxFQUFFO2dCQUNsSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLEVBQUU7b0JBQy9DLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNoRCxXQUFXLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO29CQUM3RyxtQkFBbUIsR0FBRyxDQUFDLENBQUE7aUJBQ3hCO2dCQUNELHNCQUFzQixHQUFHLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN6SCxNQUFNO2FBQ1A7aUJBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN0RSxzQkFBc0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO2dCQUM1QyxJQUFJLHNCQUFzQixDQUFDLG1CQUFtQixJQUFJLENBQUMsRUFBRTtvQkFDbkQsa0JBQWtCLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUE7b0JBQ3hDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7aUJBQ3JHO2dCQUNELE1BQU07YUFDUDtTQUNGO0tBQ0Y7SUFDRCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0MsSUFBSSxlQUFlLEdBQXFCLEVBQUUsQ0FBQTtJQUMxQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3hCLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUMxQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7U0FDYixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLE9BQU8sZUFBZSxDQUFBO0FBQ3hCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZpZXdhYmxlUGhyYXNlLCBWaWV3YWJsZVBocmFzZVR5cGUgfSBmcm9tIFwiLi4vZG9jeFBhcnNlcnMvdHlwZXNcIjtcclxuaW1wb3J0IHsgRmluZFRhZ3NPcHRzLCBGb3VuZGVkVGFnc1Bvc2l0aW9uIH0gZnJvbSBcIi4vdHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1TdHJpbmdUb1ZpZXdhYmxlUGhyYXNlcyA9IChvcHRzOiBGaW5kVGFnc09wdHMpOiBWaWV3YWJsZVBocmFzZVtdID0+IHtcclxuICBjb25zdCBzdGFydHNBbmRFbmRzOiBGb3VuZGVkVGFnc1Bvc2l0aW9uW10gPSBbXVxyXG4gIGxldCByZXF1aXJlbWVudHNUb0Nsb3NlVGFnOiB7IGFtb3VudE9mQ2xvc2luZ1RhZ3M6IG51bWJlciwgdHlwZTogVmlld2FibGVQaHJhc2VUeXBlIHwgdW5kZWZpbmVkIH0gPSB7IGFtb3VudE9mQ2xvc2luZ1RhZ3M6IDAsIHR5cGU6IHVuZGVmaW5lZCB9O1xyXG4gIGxldCBzdGFydGluZ1RhZ1Bvc2l0aW9uID0gMDtcclxuICBsZXQgY2xvc2luZ1RhZ1Bvc2l0aW9uID0gLTE7XHJcbiAgLy8gc29ydCB0YWdzIGJ5IHByaW9yaXR5LCBsb3dlciBwcmlvcml0eSBmaXJzdFxyXG4gIG9wdHMudGFncy5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eSB9KVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0cy50ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9wdHMudGFncy5sZW5ndGg7IGorKykge1xyXG4gICAgICBjb25zdCB7IHN0YXJ0VGFnLCBjbG9zZVRhZywgdHlwZTogdGFnVHlwZSB9ID0gb3B0cy50YWdzW2pdXHJcbiAgICAgIGNvbnN0IGlzU3RhcnRpbmdBVGFnID0gb3B0cy50ZXh0LnN1YnN0cmluZyhpLCBpICsgc3RhcnRUYWcubGVuZ3RoKSA9PT0gc3RhcnRUYWdcclxuICAgICAgY29uc3QgaXNFbmRpbmdBblRhZyA9IG9wdHMudGV4dC5zdWJzdHJpbmcoaSwgaSArIGNsb3NlVGFnLmxlbmd0aCkgPT09IGNsb3NlVGFnXHJcbiAgICAgIGNvbnN0IGlzVGhlTGFzdENoYXJhY3RlciA9IGkgPT09IG9wdHMudGV4dC5sZW5ndGggLSAxXHJcblxyXG4gICAgICBpZiAoKGlzVGhlTGFzdENoYXJhY3RlcikgJiYgKGkgIT0gY2xvc2luZ1RhZ1Bvc2l0aW9uKSkge1xyXG4gICAgICAgIGNvbnN0IGlzVGhlcmVUZXh0ID0gKGkgLSBjbG9zaW5nVGFnUG9zaXRpb24pID4gMFxyXG4gICAgICAgIGlzVGhlcmVUZXh0ID8gc3RhcnRzQW5kRW5kcy5wdXNoKHsgc3RhcnQ6IGNsb3NpbmdUYWdQb3NpdGlvbiwgZW5kOiBpLCB0eXBlOiBWaWV3YWJsZVBocmFzZVR5cGUudGV4dCB9KSA6IG51bGxcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzU3RhcnRpbmdBVGFnICYmICgoIXJlcXVpcmVtZW50c1RvQ2xvc2VUYWcuYW1vdW50T2ZDbG9zaW5nVGFncykgfHwgKHJlcXVpcmVtZW50c1RvQ2xvc2VUYWcudHlwZSA9PT0gdGFnVHlwZSkpKSB7XHJcbiAgICAgICAgaWYgKCFyZXF1aXJlbWVudHNUb0Nsb3NlVGFnLmFtb3VudE9mQ2xvc2luZ1RhZ3MpIHtcclxuICAgICAgICAgIGNvbnN0IGlzVGhlcmVUZXh0ID0gKGkgLSBjbG9zaW5nVGFnUG9zaXRpb24pID4gMFxyXG4gICAgICAgICAgaXNUaGVyZVRleHQgPyBzdGFydHNBbmRFbmRzLnB1c2goeyBzdGFydDogY2xvc2luZ1RhZ1Bvc2l0aW9uLCBlbmQ6IGksIHR5cGU6IFZpZXdhYmxlUGhyYXNlVHlwZS50ZXh0IH0pIDogbnVsbFxyXG4gICAgICAgICAgc3RhcnRpbmdUYWdQb3NpdGlvbiA9IGlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWlyZW1lbnRzVG9DbG9zZVRhZyA9IHsgYW1vdW50T2ZDbG9zaW5nVGFnczogcmVxdWlyZW1lbnRzVG9DbG9zZVRhZy5hbW91bnRPZkNsb3NpbmdUYWdzICsgMSwgdHlwZTogb3B0cy50YWdzW2pdLnR5cGUgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9IGVsc2UgaWYgKChpc0VuZGluZ0FuVGFnKSAmJiAodGFnVHlwZSA9PSByZXF1aXJlbWVudHNUb0Nsb3NlVGFnLnR5cGUpKSB7XHJcbiAgICAgICAgcmVxdWlyZW1lbnRzVG9DbG9zZVRhZy5hbW91bnRPZkNsb3NpbmdUYWdzLS1cclxuICAgICAgICBpZiAocmVxdWlyZW1lbnRzVG9DbG9zZVRhZy5hbW91bnRPZkNsb3NpbmdUYWdzID09IDApIHtcclxuICAgICAgICAgIGNsb3NpbmdUYWdQb3NpdGlvbiA9IGkgKyBjbG9zZVRhZy5sZW5ndGhcclxuICAgICAgICAgIHN0YXJ0c0FuZEVuZHMucHVzaCh7IHN0YXJ0OiBzdGFydGluZ1RhZ1Bvc2l0aW9uLCBlbmQ6IGNsb3NpbmdUYWdQb3NpdGlvbiwgdHlwZTogb3B0cy50YWdzW2pdLnR5cGUgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgc3RhcnRzQW5kRW5kcy5zb3J0KChhLCBiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydClcclxuXHJcbiAgbGV0IHZpZXdhYmxlUGhyYXNlczogVmlld2FibGVQaHJhc2VbXSA9IFtdXHJcbiAgc3RhcnRzQW5kRW5kcy5mb3JFYWNoKGEgPT4ge1xyXG4gICAgdmlld2FibGVQaHJhc2VzLnB1c2goe1xyXG4gICAgICB2YWx1ZTogb3B0cy50ZXh0LnN1YnN0cmluZyhhLnN0YXJ0LCBhLmVuZCksXHJcbiAgICAgIHR5cGU6IGEudHlwZVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICByZXR1cm4gdmlld2FibGVQaHJhc2VzXHJcbn0iXX0=