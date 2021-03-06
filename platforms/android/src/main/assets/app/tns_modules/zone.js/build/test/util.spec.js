describe('Util', function () {
    describe('Custom assertions', function () {
        var child = global.zone.fork();
        var grandChild = child.fork();
        describe('toBeChildOf', function () {
            it('should assert that the child zone is a child of the parent zone', function () {
                expect(child).toBeChildOf(global.zone);
                expect(grandChild).toBeChildOf(global.zone);
                expect(grandChild).toBeChildOf(child);
                expect(child).not.toBeChildOf(grandChild);
                expect(child).not.toBeChildOf(child);
            });
        });
        describe('toBeDirectChildOf', function () {
            it('should assert that the child zone is a direct child of the parent zone', function () {
                expect(child).toBeDirectChildOf(global.zone);
                expect(grandChild).toBeDirectChildOf(child);
                expect(grandChild).not.toBeDirectChildOf(global.zone);
                expect(child).not.toBeDirectChildOf(grandChild);
                expect(child).not.toBeDirectChildOf(child);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC91dGlsLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUVmLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUU5QixRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyxpRUFBaUUsRUFBRTtnQkFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV0QyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixFQUFFLENBQUMsd0VBQXdFLEVBQUU7Z0JBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1pvbmV9IGZyb20gJy4uL2xpYi9icm93c2VyL3pvbmUnO1xuXG5kZXNjcmliZSgnVXRpbCcsIGZ1bmN0aW9uICgpIHtcblxuICBkZXNjcmliZSgnQ3VzdG9tIGFzc2VydGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hpbGQgPSBnbG9iYWwuem9uZS5mb3JrKCk7XG4gICAgdmFyIGdyYW5kQ2hpbGQgPSBjaGlsZC5mb3JrKCk7XG5cbiAgICBkZXNjcmliZSgndG9CZUNoaWxkT2YnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgYXNzZXJ0IHRoYXQgdGhlIGNoaWxkIHpvbmUgaXMgYSBjaGlsZCBvZiB0aGUgcGFyZW50IHpvbmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGNoaWxkKS50b0JlQ2hpbGRPZihnbG9iYWwuem9uZSk7XG4gICAgICAgIGV4cGVjdChncmFuZENoaWxkKS50b0JlQ2hpbGRPZihnbG9iYWwuem9uZSk7XG4gICAgICAgIGV4cGVjdChncmFuZENoaWxkKS50b0JlQ2hpbGRPZihjaGlsZCk7XG5cbiAgICAgICAgZXhwZWN0KGNoaWxkKS5ub3QudG9CZUNoaWxkT2YoZ3JhbmRDaGlsZCk7XG4gICAgICAgIGV4cGVjdChjaGlsZCkubm90LnRvQmVDaGlsZE9mKGNoaWxkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3RvQmVEaXJlY3RDaGlsZE9mJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIGFzc2VydCB0aGF0IHRoZSBjaGlsZCB6b25lIGlzIGEgZGlyZWN0IGNoaWxkIG9mIHRoZSBwYXJlbnQgem9uZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoY2hpbGQpLnRvQmVEaXJlY3RDaGlsZE9mKGdsb2JhbC56b25lKTtcbiAgICAgICAgZXhwZWN0KGdyYW5kQ2hpbGQpLnRvQmVEaXJlY3RDaGlsZE9mKGNoaWxkKTtcblxuICAgICAgICBleHBlY3QoZ3JhbmRDaGlsZCkubm90LnRvQmVEaXJlY3RDaGlsZE9mKGdsb2JhbC56b25lKTtcbiAgICAgICAgZXhwZWN0KGNoaWxkKS5ub3QudG9CZURpcmVjdENoaWxkT2YoZ3JhbmRDaGlsZCk7XG4gICAgICAgIGV4cGVjdChjaGlsZCkubm90LnRvQmVEaXJlY3RDaGlsZE9mKGNoaWxkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19