import {
    Box,
    Checkbox, DialogContent, DialogTitle,
    FormControl,
    FormLabel,
    Modal,
    ModalClose,
    ModalDialog,
    RadioGroup,
    Tooltip,
    Typography
} from "@mui/joy";
import {FileDropzone} from "./FileDropzone.tsx";
import {LargeRadioButton} from "./LargeRadioButton.tsx";
import {useMemo, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {
    AppFormData,
    ROM_FILE,
    RomFileOptions,
    SELECTABLE_PATCHES,
    SelectablePatchOptions,
    TOGGLEABLE_PATCHES,
    ToggleablePatchOptions
} from "../form.tsx";
import {Info} from "@mui/icons-material";

interface RadioFormFieldProps<S extends Record<string, string>> {
    options: SelectablePatchOptions<S>,
    name: string
}

function RadioFormField<S extends Record<string, string>>({options: {options, requires, label, info}, name}: RadioFormFieldProps<S>) {
    const optionEntries = useMemo(() => Object.entries(options), [options]);

    const formData = useWatch() as AppFormData

    const visible = useMemo(() => requires(formData), [requires, formData]);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Box sx={{
            display: visible ? 'contents' : 'none'
        }}>
            <Controller
                name={name}
                render={({field: {value, onChange}}) => {
                    return (
                        <FormControl size="lg">
                            <FormLabel>{label}{info &&
                                <Tooltip title={"Click for more info"}><Info sx={{cursor: 'pointer'}}
                                                                             onClick={() => setModalOpen(true)}/></Tooltip>}</FormLabel>
                            <RadioGroup
                                orientation={"horizontal"}
                                sx={{gap: 1.5}}
                                value={value}
                                onChange={onChange}
                            >
                                {optionEntries.map(([value, label]) => <LargeRadioButton key={value} value={value}
                                                                                         label={label}/>)}
                            </RadioGroup>
                            {info && (
                                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                                    <ModalDialog variant={"soft"}>
                                        <ModalClose/>
                                        <DialogTitle>{label}</DialogTitle>
                                        <DialogContent>{info}</DialogContent>
                                    </ModalDialog>
                                </Modal>
                            )}
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

function ToggleFormField({options: {label, requires}, name}: ToggleFormFieldProps) {


    const formData = useWatch() as AppFormData

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

interface FileFormFieldProps {
    name: string,
    options: RomFileOptions
}

function FileFormField({options: {label, expectedHash}, name}: FileFormFieldProps) {
    return (
        <Controller name={name} render={({field: {value, onChange}}) => (
            <FileDropzone label={label} value={value} onChange={onChange} expectedHash={expectedHash}/>
        )}/>
    );
}

export function PatchForm() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4
        }}>
            {
                Object.entries(ROM_FILE)
                    .map(([name, options]) => (<FileFormField key={name} name={name} options={options}/>))
            }
            {
                Object.entries(SELECTABLE_PATCHES)
                    .map(([name, options]) => (
                        <RadioFormField<Record<string, string>> key={name} name={name} options={options}/>))
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