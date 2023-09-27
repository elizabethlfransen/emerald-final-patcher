import {Box, Checkbox, FormControl, FormLabel, RadioGroup, Typography} from "@mui/joy";
import {FileDropzone} from "./FileDropzone.tsx";
import {LargeRadioButton} from "./LargeRadioButton.tsx";
import { useMemo} from "react";
import {Controller, useWatch} from "react-hook-form";
import {TOGGLEABLE_PATCHES, SELECTABLE_PATCHES, SelectablePatchOptions, ToggleablePatchOptions} from "../form.ts";


interface RadioFormFieldProps {
    options: SelectablePatchOptions,
    name: string
}

export function RadioFormField({options: {options, requires, label}, name}: RadioFormFieldProps) {
    const optionEntries = useMemo(() => Object.entries(options), [options]);

    const formData = useWatch()

    const visible = useMemo(() => requires(formData), [requires, formData]);

    return (
        <Box sx={{
            display: visible ? 'contents' : 'none'
        }}>
            <Controller
                name={name}
                render={({field: {value, onChange}}) => {
                    return (
                        <FormControl size="lg">
                            <FormLabel>{label}</FormLabel>
                            <RadioGroup
                                orientation={"horizontal"}
                                sx={{gap: 1.5}}
                                value={value}
                                onChange={onChange}
                            >
                                {optionEntries.map(([value, label]) => <LargeRadioButton key={value} value={value}
                                                                                         label={label}/>)}
                            </RadioGroup>
                        </FormControl>
                    );
                }}
            />
        </Box>
    );
}


interface ToggleFormFieldProps {
    options: ToggleablePatchOptions,
    name: string
}

export function ToggleFormField({options: {label, requires}, name}: ToggleFormFieldProps) {


    const formData = useWatch()

    const visible = useMemo(() => requires(formData), [requires, formData]);
    return (
        <Box sx={{
            display: visible ? 'contents' : 'none'
        }}>
            <Controller name={name} render={({field: {value, onChange}}) => {
                return (
                    <Checkbox label={label} checked={value} onChange={onChange}/>
                )
            }}/>
        </Box>
    );
}

export function PatchForm() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4
        }}>
            <FileDropzone label={"Pokemon Emerald Rom"}/>
            {
                Object.entries(SELECTABLE_PATCHES)
                    .map(([name, options]) => (<RadioFormField key={name} name={name} options={options}/>))
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography level={"title-md"}>Toggleable Patches</Typography>
                <Box sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, 1fr)",
                    },
                }}>

                    {
                        Object.entries(TOGGLEABLE_PATCHES)
                            .map(([name, options]) => (<ToggleFormField key={name} name={name} options={options}/>))
                    }
                </Box>
            </Box>

        </Box>
    )
}