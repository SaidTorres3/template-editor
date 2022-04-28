export const setCaretPosition = (el, pos) => {
    // Loop through all child nodes
    for (var node of el.childNodes) {
        if (node.nodeType == 3) {
            // we have a text node
            if (node.length >= pos) {
                // finally add our range
                var range = document.createRange(), sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done
            }
            else {
                pos -= node.length;
            }
        }
        else {
            pos = setCaretPosition(node, pos);
            if (pos == -1) {
                return -1; // no need to finish the for loop
            }
        }
    }
    return pos; // needed because of recursion stuff
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0Q2FyZXRQb3NpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9qYXZhc2NyaXB0L3NldENhcmV0UG9zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxFQUFPLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDckQsK0JBQStCO0lBQy9CLEtBQUssSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRTtRQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ3RCLHNCQUFzQjtZQUN0QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO2dCQUN0Qix3QkFBd0I7Z0JBQ3hCLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFDaEMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDOUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7YUFDMUI7aUJBQU07Z0JBQ0wsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDcEI7U0FDRjthQUFNO1lBQ0wsR0FBRyxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsaUNBQWlDO2FBQzdDO1NBQ0Y7S0FDRjtJQUNELE9BQU8sR0FBRyxDQUFDLENBQUMsb0NBQW9DO0FBQ2xELENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzZXRDYXJldFBvc2l0aW9uID0gKGVsOiBhbnksIHBvczogbnVtYmVyKSA9PiB7XHJcbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIGNoaWxkIG5vZGVzXHJcbiAgICBmb3IgKHZhciBub2RlIG9mIGVsLmNoaWxkTm9kZXMpIHtcclxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gMykge1xyXG4gICAgICAgIC8vIHdlIGhhdmUgYSB0ZXh0IG5vZGVcclxuICAgICAgICBpZiAobm9kZS5sZW5ndGggPj0gcG9zKSB7XHJcbiAgICAgICAgICAvLyBmaW5hbGx5IGFkZCBvdXIgcmFuZ2VcclxuICAgICAgICAgIHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCksXHJcbiAgICAgICAgICAgIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIHJhbmdlLnNldFN0YXJ0KG5vZGUsIHBvcyk7XHJcbiAgICAgICAgICByYW5nZS5jb2xsYXBzZSh0cnVlKTtcclxuICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XHJcbiAgICAgICAgICByZXR1cm4gLTE7IC8vIHdlIGFyZSBkb25lXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHBvcyAtPSBub2RlLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcG9zID0gc2V0Q2FyZXRQb3NpdGlvbihub2RlLCBwb3MpO1xyXG4gICAgICAgIGlmIChwb3MgPT0gLTEpIHtcclxuICAgICAgICAgIHJldHVybiAtMTsgLy8gbm8gbmVlZCB0byBmaW5pc2ggdGhlIGZvciBsb29wXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcG9zOyAvLyBuZWVkZWQgYmVjYXVzZSBvZiByZWN1cnNpb24gc3R1ZmZcclxuICB9Il19