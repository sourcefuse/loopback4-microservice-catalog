import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import {NgxPopperjsContentComponent} from 'ngx-popperjs';
import {RecordOfAnyType, NodeWithInput} from '../../types';

@Component({
  selector: 'workflow-node',
  templateUrl: './node.component.html',
  styleUrls: [
    './node.component.scss',
    '../../../assets/icons/icomoon/style.css',
  ],
})
export class NodeComponent<E> {
  @Input()
  node: NodeWithInput<E>;

  @Input()
  isLast = false;

  @Input()
  isFirst = false;

  @Input()
  inputTemplate!: TemplateRef<RecordOfAnyType>;

  @Input()
  popupTemplate!: NgxPopperjsContentComponent;

  @Output()
  remove = new EventEmitter<boolean>();

  @Output()
  add = new EventEmitter<boolean>();

  /**
   * The removeClick() function emits a boolean value of true to the parent component
   */
  removeClick() {
    this.remove.emit(true);
  }

  /**
   * The addClick() function emits the add event, which is a boolean value of true
   */
  addClick() {
    this.add.emit(true);
  }
}
