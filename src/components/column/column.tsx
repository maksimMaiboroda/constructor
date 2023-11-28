import classNames from "classnames";
import { FC } from "react";
import { SelectableContainer } from "../selectable-container";
import { ImagePlaceholder } from "../image-placeholder";
import { Alignment, ColumnType, selectColumns } from '../../service/editorSlice';
import { Markdown } from "../markdown";
import { useAppSelector } from "../../store/store";

export interface ColumnProps {
    children?: React.ReactNode;
    selected?: boolean;
    columnId: string;
    columnType: ColumnType | null;
    onSelect?(): void;
}

export const Column: FC<ColumnProps> = ({ selected, columnId, columnType, ...props }) => {
    const columns = useAppSelector(selectColumns);

    if (columns[columnId].type === ColumnType.text) {
        const text = columns[columnId].text || '';
        const alignment = columns[columnId].alignment || Alignment.center;

        return (
            <SelectableContainer className={classNames("column", { selected })} {...props}>
                <Markdown className={`text-align-${alignment}`}>{text}</Markdown>
            </SelectableContainer>
        )
    }

    if (columns[columnId].type === ColumnType.image) {
        const imageUrl = columns[columnId].imageUrl;

        return (
            <SelectableContainer className={classNames("column", { selected })} {...props}>
                {imageUrl?.length
                    ? (<img src={imageUrl} alt="" />)
                    : <ImagePlaceholder />
                }
            </SelectableContainer>
        )
    }

    return (
        <SelectableContainer className={classNames("column", { selected })} {...props} />
    )
};
