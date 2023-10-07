import {Option, Select, Sheet, Typography} from "@mui/joy";
import PackageDetails from "../../package.json";
import {usePatches} from "./PatchProvider.tsx";

export function VersionBar() {
    const {versions, versionState: [selectedVersion, setSelectedVersion]} = usePatches();
    return (
        <Sheet variant={"outlined"} sx={{
            p: 1,
            display: 'flex',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            alignItems: "center"
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
            </Typography>
            <Select sx={{
                "&:hover": {
                    backgroundColor: "transparent",
                    color: "primary.400",
                },
                "&:not(:hover):not(.Mui-expanded) .MuiSelect-indicator": {
                  visibility: "hidden"
                },
                p: 0,
                color: "primary.500"
            }} size={"sm"} color={"primary"} variant={"plain"} value={selectedVersion} onChange={(_,nv) => setSelectedVersion(nv)}>
                {versions.map(version=> (<Option key={version.toString()} value={version}>{version.toString()}</Option>))}
            </Select>
        </Sheet>
    );
}