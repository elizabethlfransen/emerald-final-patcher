import {Transition} from "react-transition-group";
import {Box, CircularProgress, Modal, ModalDialog, Typography} from "@mui/joy";
import {useRef} from "react";

interface LoadingScreenProps {
    open: boolean
}

const time = 300;
const totalTime = time + 100;

export function LoadingScreen({open}: LoadingScreenProps) {

    const ref = useRef(null);

    // @ts-ignore
    return (
        <>
            <Transition nodeRef={ref} in={open} timeout={totalTime}>

                {
                    (state: string) => (
                        <Modal
                            ref={ref}
                            keepMounted
                            open={!['exited', 'exiting'].includes(state)}
                            slotProps={{
                                backdrop: {
                                    sx: {
                                        opacity: 0,
                                        backdropFilter: 'none',
                                        transition: `opacity ${totalTime}ms, backdrop-filter ${totalTime}ms`,
                                        ...{
                                            entering: {opacity: 1, backdropFilter: 'blur(8px)'},
                                            entered: {opacity: 1, backdropFilter: 'blur(8px)'},
                                        }[state],
                                    },
                                },
                            }}
                            sx={{
                                visibility: state === 'exited' ? 'hidden' : 'visible',
                            }}
                        >
                            <ModalDialog
                                sx={{
                                    opacity: 0,
                                    transition: `opacity ${time}ms`,
                                    ...{
                                        entering: {opacity: 1},
                                        entered: {opacity: 1},
                                    }[state],
                                }}
                                layout={"fullscreen"}
                            >
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                }} component={"main"}>
                                    <Typography level={"h1"} sx={{
                                        mb: 3
                                    }}>Emerald Final Patcher</Typography>
                                    <CircularProgress variant={"plain"} size={"lg"}/>
                                </Box>
                            </ModalDialog>
                        </Modal>
                    ) as any
                }
            </Transition>
        </>
    );
}