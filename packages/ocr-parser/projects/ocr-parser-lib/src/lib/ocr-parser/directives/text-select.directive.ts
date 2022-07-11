// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  NgZone,
} from '@angular/core';
export interface TextSelectEvent {
  text: string;
  viewportRectangle: SelectionRectangle | null;
  hostRectangle: SelectionRectangle | null;
}
export interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}
@Directive({
  selector: '[textSelect]',
  outputs: ['textSelectEvent: textSelect'],
})
export class TextSelectDirective implements OnInit, OnDestroy {
  public textSelectEvent: EventEmitter<TextSelectEvent>;
  private readonly elementRef: ElementRef;
  private hasSelection: boolean;
  private readonly zone: NgZone;
  // I initialize the text-select directive.
  constructor(elementRef: ElementRef, zone: NgZone) {
    this.elementRef = elementRef;
    this.zone = zone;
    this.hasSelection = false;
    this.textSelectEvent = new EventEmitter();
  }

  // ---
  // PUBLIC METHODS.
  // ---
  // I get called once when the directive is being unmounted.
  public ngOnDestroy(): void {
    // Unbind all handlers, even ones that may not be bounds at this moment.
    this.elementRef.nativeElement.removeEventListener(
      'mousedown',
      this.handleMousedown,
      false,
    );
    document.removeEventListener('mouseup', this.handleMouseup, false);
  }

  // I get called once after the inputs have been bound for the first time.
  public ngOnInit(): void {
    // Since not all interactions will lead to an event that is meaningful to the
    // calling context, we want to setup the DOM bindings outside of the Angular
    // Zone. This way, we don't trigger any change-detection digests until we know
    // that we have a computed event to emit.
    this.zone.runOutsideAngular(() => {
      // While there are several ways to create a selection on the page, this
      // directive is only going to be concerned with selections that were
      // initiated by MOUSE-based selections within the current element.
      this.elementRef.nativeElement.addEventListener(
        'mousedown',
        this.handleMousedown,
        false,
      );
    });
  }

  // ---
  // PRIVATE METHODS.
  // ---

  // I get the deepest Element node in the DOM tree that contains the entire range.
  private getRangeContainer(range: Range): Node {
    let container = range.commonAncestorContainer;
    // If the selected node is a Text node, climb up to an element node - in Internet
    // Explorer, the .contains() method only works with Element nodes.
    while (container.nodeType !== Node.ELEMENT_NODE) {
      if (container.parentNode) {
        container = container.parentNode;
      }
    }
    return container;
  }

  // I handle mousedown events inside the current element.
  private readonly handleMousedown = (): void => {
    document.addEventListener('mouseup', this.handleMouseup, false);
  };

  // I handle mouseup events anywhere in the document.
  private readonly handleMouseup = (): void => {
    document.removeEventListener('mouseup', this.handleMouseup, false);
    this.processSelection();
  };

  // I inspect the document's current selection and check to see if it should be
  // emitted as a TextSelectEvent within the current element.
  private processSelection(): void {
    const selection = document.getSelection();
    // If there is a new selection and an existing selection, let's clear out the
    // existing selection first.
    if (this.hasSelection) {
      // Since emitting event may cause the calling context to change state, we
      // want to run the .emit() inside of the Angular Zone. This way, it can
      // trigger change detection and update the views.
      this.zone.runGuarded(() => {
        this.hasSelection = false;
        this.textSelectEvent.emit({
          text: '',
          viewportRectangle: null,
          hostRectangle: null,
        });
      });
    }

    // If the new selection is empty (for example, the user just clicked somewhere
    // in the document), then there's no new selection event to emit.
    if (!selection?.rangeCount || !selection.toString()) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rangeContainer = this.getRangeContainer(range);
    // We only want to emit events for selections that are fully contained within the
    // host element. If the selection bleeds out-of or in-to the host, then we'll
    // just ignore it since we don't control the outer portions.
    if (this.elementRef.nativeElement.contains(rangeContainer)) {
      const viewportRectangle = range.getBoundingClientRect();
      const localRectangle = this.viewportToHost(
        viewportRectangle,
        rangeContainer,
      );

      // Since emitting event may cause the calling context to change state, we
      // want to run the .emit() inside of the Angular Zone. This way, it can
      // trigger change detection and update the views.
      this.zone.runGuarded(() => {
        this.hasSelection = true;
        this.textSelectEvent.emit({
          text: selection?.toString() || '',
          viewportRectangle: {
            left: viewportRectangle.left,
            top: viewportRectangle.top,
            width: viewportRectangle.width,
            height: viewportRectangle.height,
          },
          hostRectangle: {
            left: localRectangle.left,
            top: localRectangle.top,
            width: localRectangle.width,
            height: localRectangle.height,
          },
        });
      });
    }
  }

  // I convert the given viewport-relative rectangle to a host-relative rectangle.
  // --
  // NOTE: This algorithm doesn't care if the host element has a position - it simply
  // walks up the DOM tree looking for offsets.
  private viewportToHost(
    viewportRectangle: SelectionRectangle,
    rangeContainer: Node,
  ): SelectionRectangle {
    const host = this.elementRef.nativeElement;
    const hostRectangle = host.getBoundingClientRect();

    // Both the selection rectangle and the host rectangle are calculated relative to
    // the browser viewport. As such, the local position of the selection within the
    // host element should just be the delta of the two rectangles.
    let localLeft = viewportRectangle.left - hostRectangle.left;
    let localTop = viewportRectangle.top - hostRectangle.top;

    let node = rangeContainer;
    // Now that we have the local position, we have to account for any scrolling
    // being performed within the host element. Let's walk from the range container
    // up to the host element and add any relevant scroll offsets to the calculated
    // local position.
    if (node.parentNode) {
      do {
        localLeft += (node as Element).scrollLeft;
        localTop += (node as Element).scrollTop;
      } while (node !== host && (node = node.parentNode));
    }
    return {
      left: localLeft,
      top: localTop,
      width: viewportRectangle.width,
      height: viewportRectangle.height,
    };
  }
}
