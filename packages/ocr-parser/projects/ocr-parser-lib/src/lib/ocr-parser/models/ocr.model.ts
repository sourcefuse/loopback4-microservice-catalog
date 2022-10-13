// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export class DocumentConfig {
    docType?: string;
    tabName?: string;
    document: string[] | undefined;
    constructor(data?: DocumentConfig) {
        this.docType = data?.docType;
        this.tabName = data?.tabName;
        this.document = data?.document;
    }
}

export class FieldConfig {
    tabName?: string;
    fieldData?: FieldData[];

    constructor(data?: FieldConfig) {
        this.tabName = data?.tabName;
        this.fieldData = data?.fieldData?.map(resp => new FieldData(resp));
    }
}

export class FieldData {
    isSelected: boolean;
    label?: string;
    pageNum?: number;
    score: number;
    value?: string;
    color: string;
    id?: string;
    previousValue?: string;
    tabName?: string;
    supportedText: string;
    coordinates?: { x: number, y: number, height: number, width: number };

    constructor(data?: FieldData) {
        this.isSelected = data?.isSelected || false;
        this.label = data?.label;
        this.pageNum = data?.pageNum;
        this.score = data?.score || 0;
        this.value = data?.value || '';
        this.coordinates = data?.coordinates;
        this.color = data?.color || '';
        this.id = data?.id;
        this.previousValue = data?.previousValue || '';
        this.tabName = data?.tabName;
        this.supportedText = data?.supportedText || '';
    }
}

export interface SelectedClause {
    isScroll: boolean,
    fieldData: FieldData
}
