import {Directive, DoCheck, ElementRef, Input, OnInit} from '@angular/core';

declare const $: any;

@Directive({
  selector: '[appTableSort]'
})

export class TableSortDirective implements OnInit, DoCheck {

  @Input() relatedData: any;

  thead: any = null;
  tbody: any = null;
  rows: any[] = [];

  oldRelatedData: any;

  sortingColumn: number;
  sortingOrder: boolean;

  firstInit: boolean;

  constructor(private el: ElementRef) {
    this.oldRelatedData = this.relatedData;
  }

  ngOnInit(): void {
    this.sortingColumn = 0;
    this.initialize();
  }

  ngDoCheck(): void {
    // console.log(this.relatedData);
    if (this.oldRelatedData !== this.relatedData) {
      // console.log(this.relatedData);
      const self = this;
      setTimeout(function(){self.initialize();}, 500);
      // this.initialize();
      this.oldRelatedData = this.relatedData;
    }
  }

  initialize(): void {
    this.thead = $(this.el.nativeElement).find('thead');
    this.tbody = $(this.el.nativeElement).find('tbody');
    // console.log(this.tbody.find('tr'));
    this.rows = [];
    const self = this;
    $(this.tbody).find($('tr')).each(function (index) {
      // console.log(index);
      const row = [];
      $(this).find($('td')).each(function (i) {
        row.push($(this).text());
      });
      row.push($(this));
      self.rows.push(row);
    });

    if (!this.firstInit) {
      this.firstInit = true;
      $(this.thead).find('tr:first-child th').each(function (index) {
        const p = $('<span class="arrow-000-dir"></span>');
        $(p).css({'font-size': '8px', 'vertical-align': 'middle'});
        $(this).append(p);
      });
      $(this.thead).find('tr:first-child th').each(function (index) {
        $(this).css({cursor: 'pointer'});
        $(this).click(function () {
          $(self.thead).find('tr:first-child th').each(function (i) {
            $(this).find('.arrow-000-dir').html('');
          });
          // console.log(self.sortingColumn, index);
          if (self.sortingColumn === index) {
            // console.log(self.sortingColumn);
            if (self.sortingOrder) {
              self.sortingOrder = false;
              $(this).find('.arrow-000-dir').html('&#9650;');
            } else {
              self.sortingOrder = true;
              $(this).find('.arrow-000-dir').html('&#9660;');
            }
            self.rows.reverse();
          } else {
            self.sortingColumn = index;
            self.sortingOrder = true;
            $(this).find('.arrow-000-dir').html('&#9660;');
            self.rows.sort(function (a, b) {
              return a[index] > b[index] ? 1 : -1;
            });
          }
          self.reorder();
        });
      });
    }
    // console.log('rows', this.rows);
  }

  reorder(): void {
    $(this.tbody).find('tr').each(function (index) {
      $(this).detach();
    });
    for (let i = 0; i <  this.rows.length; i++) {
      $(this.tbody).append(this.rows[i][this.rows[i].length - 1]);
    }
  }

}
