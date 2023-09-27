import {Radio, Sheet} from "@mui/joy";
import {ReactNode} from "react";

export interface LargeRadioButtonProps {
    value: unknown,
    label?: ReactNode
}

export function LargeRadioButton({value, label}: LargeRadioButtonProps) {
    return (
        <Sheet
            sx={{
                p: 2,
                borderRadius: 'md',
                boxShadow: 'sm',
                flexGrow: 1
            }}
        >
            <Radio
                label={label}
                overlay
                disableIcon
                value={value}
                slotProps={{
                    label: ({ checked }) => ({
                        sx: {
                            fontWeight: 'lg',
                            fontSize: 'md',
                            color: checked ? 'text.primary' : 'text.secondary',
                        },
                    }),
                    action: ({ checked }) => ({
                        sx: (theme) => ({
                            ...(checked && {
                                '--variant-borderWidth': '2px',
                                '&&': {
                                    // && to increase the specificity to win the base :hover styles
                                    borderColor: theme.vars.palette.primary[500],
                                },
                            }),
                        }),
                    }),
                }}
            />
        </Sheet>
    )
}