import {Sheet, Typography} from "@mui/joy";
import PackageDetails from "../../package.json";

export function VersionBar() {
    return (
        <Sheet variant={"outlined"} sx={{
            p: 1,
            display: 'flex',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
        }}>
            <Typography mr={2}>
                <Typography color="neutral" level={"title-sm"} mr={1}>
                    Patcher Version
                </Typography>
                <Typography color="primary" level={"title-sm"}>
                    {PackageDetails.version}
                </Typography>
            </Typography>

            <Typography>
                <Typography color="neutral" level={"title-sm"} mr={1}>
                    Patch Version
                </Typography>
                <Typography color="primary" level={"title-sm"}>
                    N/A
                </Typography>
            </Typography>
        </Sheet>
    );
}