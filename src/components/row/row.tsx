import classNames from "classnames";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { SelectableContainer } from "../selectable-container";
import { Column } from '../column';
import { InputActiveMode } from "../editor";
import {
    setActiveColumn,
    getActiveColumnId,
    selectColumns,
    ColumnType
} from '../../service/editorSlice';

export interface RowProps {
    children?: React.ReactNode;
    selected?: boolean;
    rowId: string;
    columnIds: string[];
    onSelect?(): void;
    setActiveMode: React.Dispatch<React.SetStateAction<InputActiveMode>>;
}

interface SelectColumn {
    columnId: string;
    columnType: string | undefined,
}

export const Row: FC<RowProps> = ({ selected, columnIds, setActiveMode, rowId, ...props }) => {
    const dispatch = useAppDispatch();
    const columns = useAppSelector(selectColumns);
    const activeColumnId = useAppSelector(getActiveColumnId);

    const handleSelectColumn = ({ columnId, columnType }: SelectColumn) => () => {
        dispatch(setActiveColumn({ columnId, rowId }));
        if (columnType === ColumnType.text) {
            setActiveMode(prev => ({
                ...prev,
                addColumn: true,
                showContentToggle: true,
                inputText: true,
                inputImage: false,
                showTextareaFocus: true,
                showInputFocus: true,
            }))
            return;
        }

        if (columnType === ColumnType.image) {
            setActiveMode(prev => ({
                ...prev,
                addColumn: true,
                showContentToggle: true,
                inputText: false,
                inputImage: true,
                showTextareaFocus: true,
                showInputFocus: true,
            }))
            return;
        }

        setActiveMode(prev => ({
            ...prev,
            addColumn: true,
            showContentToggle: true,
            inputText: false,
            inputImage: false
        }))
    }

    return (
        <SelectableContainer className={classNames("row", { selected })} {...props}>
            {columnIds.map(columnId => {
                const columnType = columns[columnId].type;

                return (
                    <Column
                        key={columnId}
                        columnId={columnId}
                        columnType={columnType || null}
                        onSelect={handleSelectColumn({ columnId, columnType })}
                        selected={activeColumnId === columnId}
                    />
                )
            })}
        </SelectableContainer>
    )
};
