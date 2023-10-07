import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {PatchProvider, VersionGroup} from "../rom-patcher/patch-provider.ts";
import {Version} from "../version.ts";
import {LoadingScreen} from "./LoadingScreen.tsx";

type State<S> = [S, Dispatch<SetStateAction<S>>]

interface PatchProviderState {
    loading: boolean,
    patches: VersionGroup,
    versions: string[],
    versionState: State<string | null>
}

const PatchProviderContext = createContext<PatchProviderState>(undefined!);

export function PatchProvider({provider, children}: { provider: PatchProvider, children?: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [patches, setPatches] = useState<VersionGroup>({});
    const [version,setVersion] = useState<string | null>(null);
    const [versions, setVersions] = useState<string[]>([]);
    const patchProviderState = useMemo<PatchProviderState>(() => ({
        loading,
        patches,
        versions,
        versionState: [version,setVersion],
    }), [loading, patches, version,setVersion, versions]);
    const setPatchProviderState = useCallback((state: null | VersionGroup) => {
        if(state == null) {
            setLoading(true);
            setPatches({});
            setVersions([]);
            return;
        }
        setLoading(false);
        setPatches(state);
        const sortedVersions = Object.keys(state)
            .map(Version.parse)
            .filter(x => x != null)
            .map(x => x as Version)
            .sort((a, b) => -a.compareTo(b))
            .map(x => x.toString());

        setVersions(sortedVersions);
        setVersion(sortedVersions[0] ?? null);
    }, [])

    useEffect(() => {
        const abortController = new AbortController();
        setPatchProviderState(null);
        (async () => {
            const patches = await provider(abortController.signal);
            if(abortController.signal.aborted) return;
            setPatchProviderState(patches);
        })();
        return (() => abortController.abort("Component removed"));
    }, [setPatchProviderState, provider]);
    return (
        <PatchProviderContext.Provider value={patchProviderState}>
            <LoadingScreen open={loading}/>
            {children}
        </PatchProviderContext.Provider>
    )
}
export function usePatches(): PatchProviderState {
    return useContext(PatchProviderContext);
}