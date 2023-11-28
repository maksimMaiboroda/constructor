import { v4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

type PageId = string;
type RowId = string;
type ColumnId = string;

export enum Alignment {
    left = 'left',
    right = 'right',
    center = 'center'
}

export enum ColumnType {
    text = 'text',
    image = 'image'
}

interface Page {
    id: PageId;
    rowIds: RowId[];
}

interface Row {
    id: RowId;
    columnIds: ColumnId[];
}

export interface Column {
    id: ColumnId;
    text?: string;
    alignment?: Alignment;
    imageUrl?: string;
    type?: ColumnType;
}

interface UpdateTextColumn {
    text?: string;
    alignment?: Alignment
}

interface AddColumn {
    rowId: RowId
}

interface UpdateImageColumn {
    imageUrl: string;
}

interface SetActiveColumn {
    rowId: string;
    columnId: string;
}

interface EditorState {
    pages: {
        [key in PageId]: Page;
    };
    rows: {
        [key in RowId]: Row;
    };
    columns: {
        [key in ColumnId]: Column;
    };
    activePageId: PageId;
    activeRowId: RowId;
    activeColumnId: ColumnId;
    selectedRowId: RowId
}

const initialPageId = v4();
const initialRowId = v4();
const initialColumnId = v4();

const initialState: EditorState = {
    pages: {
        [initialPageId]: {
            id: initialPageId,
            rowIds: [
                initialRowId
            ]
        }
    },
    rows: {
        [initialRowId]: {
            id: initialRowId,
            columnIds: [
                initialColumnId
            ]
        }
    },
    columns: {
        [initialColumnId]: {
            id: initialColumnId,
            text: '# Untitled',
            alignment: Alignment.center,
            type: ColumnType.text,
        }
    },
    activePageId: initialPageId,
    activeRowId: "",
    activeColumnId: "",
    selectedRowId: ""
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        addRow: (state) => {
            const activePage = state.pages[state.activePageId];
            const newRow = {
                id: v4(),
                columnIds: []
            }

            state.rows[newRow.id] = newRow;
            activePage.rowIds.push(newRow.id);
            state.activeColumnId = '';
            state.activeRowId = newRow.id;
            state.selectedRowId = newRow.id;
        },
        addColumn: (state, action: PayloadAction<AddColumn>) => {
            const selectedRow = state.rows[state.selectedRowId];
            const newColumn = {
                id: v4(),
                alignment: Alignment.left
            }

            state.columns[newColumn.id] = newColumn;
            selectedRow.columnIds.push(newColumn.id)
            state.activeColumnId = newColumn.id;
            state.activeRowId = '';
        },
        setTextColumn: (state, action: PayloadAction<Column>) => {
            if (!action.payload.text) {
                state.columns[action.payload.id] = {
                    id: action.payload.id,
                    text: '',
                    alignment: Alignment.left,
                    type: ColumnType.text
                };

                return;
            }

            state.columns[action.payload.id] = {
                id: action.payload.id,
                text: action.payload.text,
                alignment: action.payload.alignment,
                type: ColumnType.text
            };
        },
        setImageColumn: (state, action: PayloadAction<Column>) => {
            if (!action.payload.imageUrl) {
                state.columns[action.payload.id] = {
                    id: action.payload.id,
                    imageUrl: '',
                    type: ColumnType.image
                };

                return;
            }


            state.columns[action.payload.id] = {
                id: action.payload.id,
                imageUrl: action.payload.imageUrl,
                type: ColumnType.image
            };
        },
        updateTextColumn: (state, action: PayloadAction<UpdateTextColumn>) => {
            const column = state.columns[state.activeColumnId];

            if(action.payload.hasOwnProperty('text')){
                column.text = action.payload.text 
            }

            if(action.payload.hasOwnProperty('alignment')){
                column.alignment = action.payload.alignment
            }

            column.imageUrl = '';
            column.type = ColumnType.text;
        },
        updateImageColumn: (state, action: PayloadAction<UpdateImageColumn>) => {
            const column = state.columns[state.activeColumnId];

            column.text = '';
            column.imageUrl = action.payload.imageUrl;
            column.type = ColumnType.image;
        },
        setActivePage: (state, action: PayloadAction<PageId | null>) => {
            if (action.payload === null) {
                state.activePageId = '';
                return;
            }

            state.activePageId = action.payload;
        },
        setActiveRow: (state, action: PayloadAction<RowId | null>) => {
            if (action.payload === null) {
                state.activeRowId = '';
                return;
            }

            state.activeRowId = action.payload;
            state.selectedRowId = action.payload;
            state.activeColumnId = '';
        },
        setActiveColumn: (state, action: PayloadAction<SetActiveColumn>) => {
            if (action.payload === null) {
                state.activeColumnId = '';
                return;
            }

            state.activeColumnId = action.payload.columnId;
            state.selectedRowId = action.payload.rowId;
            state.activeRowId = '';
        },
        setActiveReset: (state) => {
            state.activeRowId = '';
            state.activeColumnId = '';
            state.selectedRowId = ''
        },
    },
});

export const selectPages = (state: RootState) => state.editor.pages;
export const selectRows = (state: RootState) => state.editor.rows;
export const selectColumns = (state: RootState) => state.editor.columns;

export const getActivePage = (state: RootState) => state.editor.pages[state.editor.activePageId];
export const getActiveRowId = (state: RootState) => state.editor.activeRowId;
export const getActiveColumnId = (state: RootState) => state.editor.activeColumnId;

export const {
    addRow,
    addColumn,
    setActivePage,
    setActiveRow,
    setActiveColumn,
    setTextColumn,
    setImageColumn,
    updateTextColumn,
    updateImageColumn,
    setActiveReset
} = editorSlice.actions;