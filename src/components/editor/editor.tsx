import { FC, useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Icons } from "../icons";
import { Row } from "../row";
import { Stage } from "../stage";
import {
    getActivePage,
    getActiveColumnId,
    selectRows,
    selectColumns,
    setActiveRow,
    getActiveRowId,
    updateTextColumn,
    addRow,
    addColumn,
    ColumnType,
    updateImageColumn,
    Alignment,
    setActiveReset
} from '../../service/editorSlice';


export interface InputActiveMode {
    addColumn: boolean,
    showContentToggle: boolean,
    inputText: boolean;
    inputImage: boolean;
    showInputFocus: boolean;
    showTextareaFocus: boolean
}

export const Editor: FC = () => {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [activeMode, setActiveMode] = useState<InputActiveMode>({
        addColumn: false,
        showContentToggle: false,
        inputText: false,
        inputImage: false,
        showInputFocus: false,
        showTextareaFocus: false
    })
    const activePage = useAppSelector(getActivePage);
    const activeRowId = useAppSelector(getActiveRowId);
    const rows = useAppSelector(selectRows);
    const columns = useAppSelector(selectColumns);
    const activeColumnId = useAppSelector(getActiveColumnId);
    const activeColumn = columns[activeColumnId]

    useEffect(() => {
        if (activeMode.showInputFocus && inputRef.current) {
            inputRef.current.focus();
        }

        if (activeMode.showTextareaFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [activeMode]);

    const handleSelectRow = (rowId: string) => () => {
        dispatch(setActiveRow(rowId));
        setActiveMode(prev => ({
            ...prev,
            addColumn: true,
            showContentToggle: false,
            inputText: false,
            inputImage: false
        }))
    }

    const handleAddRow = () => {
        dispatch(addRow());

        setActiveMode(prev => ({
            ...prev,
            addColumn: true,
            showContentToggle: false,
            inputText: false,
            inputImage: false
        }))
    }

    const handleAddColumn = () => {
        dispatch(addColumn({ rowId: activeRowId }));

        setActiveMode(prev => ({
            ...prev,
            addColumn: true,
            showContentToggle: true,
            inputText: false,
            inputImage: false,
            showTextareaFocus: false,
            showInputFocus: false,
        }))
    }

    const handleSelectContentType = (type: ColumnType) => () => {
        if (type === ColumnType.text) {
            dispatch(updateTextColumn({ text: '' }));
            setActiveMode(prev => ({
                ...prev,
                addColumn: true,
                showContentToggle: true,
                inputText: true,
                showTextareaFocus: true,
                showInputFocus: false,
                inputImage: false
            }))
            return;
        }

        if (type === ColumnType.image) {
            dispatch(updateImageColumn({ imageUrl: '' }));
            setActiveMode(prev => ({
                ...prev,
                addColumn: true,
                showContentToggle: true,
                inputText: false,
                inputImage: true,
                showTextareaFocus: false,
                showInputFocus: true,
            }))
            return;
        }
    }

    const handleAlignText = (alignment: Alignment) => () => {
        dispatch(updateTextColumn({ alignment }));
    }

    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        dispatch(updateTextColumn({ text: value }));
    }

    const handleChangeImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(updateImageColumn({ imageUrl: value }));
    }

    const handleSelectedStage = () => {
        dispatch(setActiveReset())
        setActiveMode(prev => ({
            ...prev,
            addColumn: false,
            showContentToggle: false,
            inputText: false,
            inputImage: false,
            showTextareaFocus: false,
            showInputFocus: false,
        }))
    }

    return (
        <div className="editor">
            <Stage onSelect={handleSelectedStage}>
                {activePage.rowIds.map(rowId => {
                    return (
                        <Row
                            key={rowId}
                            rowId={rowId}
                            columnIds={rows[rowId].columnIds}
                            onSelect={handleSelectRow(rowId)}
                            selected={activeRowId === rowId}
                            setActiveMode={setActiveMode}
                        />
                    )
                })}
            </Stage>
            <div className="properties">
                <div className="section">
                    <div className="section-header">Page</div>
                    <div className="actions">
                        <button className="action" onClick={handleAddRow}>Add row</button>
                    </div>
                </div>
                {activeMode.addColumn
                    ? (<div className="section">
                        <div className="section-header">Row</div>
                        <div className="actions">
                            <button className="action" onClick={handleAddColumn}>Add column</button>
                        </div>
                    </div>)
                    : null
                }
                {activeMode.showContentToggle
                    ? (<div className="section">
                        <div className="section-header">Column</div>
                        <div className="button-group-field">
                            <label>Contents</label>
                            <div className="button-group">
                                <button className={activeMode.inputText ? "selected" : ''} onClick={handleSelectContentType(ColumnType.text)}>
                                    <Icons.Text />
                                </button>
                                <button className={activeMode.inputImage ? "selected" : ''} onClick={handleSelectContentType(ColumnType.image)}>
                                    <Icons.Image />
                                </button>
                            </div>
                        </div>
                    </div>)
                    : null
                }
                {activeMode.inputText
                    ? (<div className="section">
                        <div className="section-header">Text</div>
                        <div className="button-group-field">
                            <label>Alignment</label>
                            <div className="button-group">
                                <button
                                    className={activeColumn?.alignment === Alignment.left ? "selected" : ''}
                                    onClick={handleAlignText(Alignment.left)}
                                >
                                    <Icons.TextAlignLeft />
                                </button>
                                <button
                                    className={activeColumn?.alignment === Alignment.center ? "selected" : ''}
                                    onClick={handleAlignText(Alignment.center)}
                                >
                                    <Icons.TextAlignCenter />
                                </button>
                                <button
                                    className={activeColumn?.alignment === Alignment.right ? "selected" : ''}
                                    onClick={handleAlignText(Alignment.right)}
                                >
                                    <Icons.TextAlignRight />
                                </button>
                            </div>
                        </div>
                        <div className="textarea-field">
                            <textarea
                                ref={textareaRef}
                                rows={8}
                                placeholder="Enter text"
                                onChange={handleChangeText}
                                value={activeColumn?.text || ''}
                            ></textarea>
                        </div>
                    </div>)
                    : null
                }
                {activeMode.inputImage
                    ? (<div className="section">
                        <div className="section-header">Image</div>
                        <div className="text-field">
                            <label htmlFor="image-url">URL</label>
                            <input
                                ref={inputRef}
                                id="image-url"
                                type="text"
                                onChange={handleChangeImageUrl}
                                value={activeColumn?.imageUrl || ''}
                            />
                        </div>
                    </div>)
                    : null
                }
            </div>
        </div >
    )
};
