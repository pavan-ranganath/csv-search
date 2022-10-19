import { Component, ElementRef, ViewChild } from '@angular/core';
import * as dfd from "danfojs"
import { DataFrame } from 'danfojs/dist/danfojs-base';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('plot_div') el: ElementRef;


  // searchTerm = "";

  // showPlot: boolean = true;
  // excelUploaded: boolean = false;
  // noOfSheets = 2;
  // df: dfd.DataFrame;



  searchTerm = "";

  showPlot: boolean = true;
  excelUploaded: boolean = false;
  noOfSheets = 3;
  df: dfd.DataFrame;


  constructor() { }
  // onFileChange($event: Event) {
  //   const excelFile = ($event.target as any).files[0]
  //   dfd.readExcel(excelFile).then((df: dfd.DataFrame) => {
  //     this.df = df;
  //     this.excelUploaded = true;
  //     this.searchColumn0(this.df,"")
  //     // this.searchColumn0(df)
  //   })
  // }

  // searchColumn0(df: dfd.DataFrame, search: string = this.searchTerm) {
  //   let y: dfd.Series = df[df.columns[0]].str.search(search)
  //   let a = y.values.map(function (item) { return item == 0 ? true : false; });
  //   let t: dfd.DataFrame = df.loc({ rows: a });
  //   const headerStyle = {
  //     whiteSpace: 'normal',
  //     height: 'auto',
  //     // align: "center",
  //     // fill: { color: ["gray"] },
  //     // font: { family: "Arial", size: 15, color: "white" },
  //     columnwidth: 200,
  //   };
  //   const cellStyle = {
  //     // align: ["center"],
  //     // line: { color: "black", width: 10 },
  //     // columnwidth: [80,400]
  //   };
  //   t.plot("plot_div").table({
  //     config: {
  //       tableHeaderStyle: headerStyle,
  //       // tableCellStyle: cellStyle,
  //     },
  //     layout: {
  //       title: "Table displaying the dataset for " + this.searchTerm,
  //     },
  //   });
  // }
  // handleChange($event: Event) {
  //   this.searchTerm = ($event as any).detail.value;
  //   if (this.searchTerm) {
  //     // this.el.nativeElement.style.display = 'block';
  //     this.searchColumn0(this.df)
  //   } else {
  //     this.searchColumn0(this.df, "")
  //     // this.el.nativeElement.style.display = 'none'
  //   }
  // }

  async onFileChange($event: Event) {
    const excelFile = ($event.target as any).files[0]
    let dfs: dfd.DataFrame[] = []
    for (let index = 0; index < this.noOfSheets; index++) {
      let tempDf: any = await dfd.readExcel(excelFile, { sheet: index });
      dfs.push(tempDf);
    }
    let mergerdDf = dfs[0];
    for (let j = 1; j < dfs.length; j++) {
      mergerdDf = dfd.merge({left:mergerdDf,right:dfs[j],on:[dfs[0].columns[0]],how:"inner"})
    }
    this.df = mergerdDf as DataFrame;
    this.excelUploaded = true;
    this.searchColumn0(this.df, "")
  }

  searchColumn0(df: dfd.DataFrame, search: string = this.searchTerm) {
    let y: dfd.Series = df[df.columns[0]].str.search(search)
    let a = y.values.map(function (item) { return item == 0 ? true : false; });
    let t: dfd.DataFrame = df.loc({ rows: a });
    const headerStyle = {
      whiteSpace: 'normal',
      height: 'auto',
      // align: "center",
      // fill: { color: ["gray"] },
      // font: { family: "Arial", size: 15, color: "white" },
      columnwidth: 200,
    };
    const cellStyle = {
      // align: ["center"],
      // line: { color: "black", width: 10 },
      // columnwidth: [80,400]
    };
    t.plot("plot_div").table({
      config: {
        tableHeaderStyle: headerStyle,
        // tableCellStyle: cellStyle,
      },
      layout: {
        title: "Table displaying the dataset for " + this.searchTerm,
      },
    });
  }
  handleChange($event: Event) {
    this.searchTerm = ($event as any).detail.value;
    if (this.searchTerm) {
      // this.el.nativeElement.style.display = 'block';
      this.searchColumn0(this.df)
    } else {
      this.searchColumn0(this.df, "")
      // this.el.nativeElement.style.display = 'none'
    }
  }
}


