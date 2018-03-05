# Angular Directive to Sort Data Tables

Install:

```
    npm install ng-table-sort
```

Usage:

```
    /*** app.ts ***/

    ...
    import { TableSortDirective } from '../ng-table-sort/table-sort.directive';

    @NgModule({
      declarations: [
        ...,
        TableSortDirective
      ],
      
    ...
```

```
    <!-- template html -->

    <table [relatedData]="data_used_in_the_table">
        <thead>
            <tr>
                <th> Column 1 </th>
                <th> Column 2 </th>
                <th> Column 3 </th>
                ...
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let data of data_used_in_the_table">
                <td>{{data.anything}}</td>
                <td>{{data.could.be.nested}}</td>
                <td>Or text unrelated with the data</td>
                ...
            </tr>
        </tbody>
```
