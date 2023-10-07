import {PatchGroup, PatchProvider} from "./patch-provider.ts";
import {Octokit} from "octokit";
import {Version} from "../version.ts";
import {useCallback, useMemo} from "react";

type Node = Awaited<ReturnType<Octokit["rest"]["git"]["getTree"]>>["data"]["tree"][number];
type RecursiveNode = Node & {
    name: string,
    children?: Record<string, RecursiveNode>
}

function mapObjectValues<V,R>(obj: Record<string,V>, mapFn: ((value: V) => R)) {

}

function unflatten(nodes: Node[]): Record<string, RecursiveNode> {
    const result: Record<string, RecursiveNode> = {};
    nodes.forEach(node => {
        let parent = result;
        const path = node.path!.split("/");
        while (path.length > 1) {
            const pathElement = path.shift()!;
            if (!(pathElement in parent)) throw new Error(`Could not get parent node for ${node.path}`);
            const parentNode = parent[pathElement];
            if (parentNode.children == undefined) {
                parentNode.children = {};
            }
            parent = parentNode.children;
        }
        parent[path[0]] = {...node, name: path[0]};
    });
    return result;
}

function getVersion(node: RecursiveNode): [string, PatchGroup] | null {
    if (Version.parse(node.name) == null)
        return null;
    return [node.name, {}];
}

export function useGitHubPatchProvider(repoAndBranch: string): PatchProvider {
    const repoParts = useMemo(() => {
        const repoParts = /^(.*?)\/(.*?)\/(.*?)$/.exec(repoAndBranch);
        if (repoParts == null) throw new Error(`expected repo syntax to be :owner/:repo/:branch but received '${repoAndBranch}'`);
        return repoParts;
    }, [repoAndBranch]);


    return useCallback(async (signal) => {
        const [, owner, repo, branch] = repoParts;
        const client = new Octokit();
        const response = await client.rest.git.getTree({
            owner,
            repo,
            tree_sha: `heads/${branch}`,
            recursive: "true",
            request: {
                signal
            }
        });
        signal.throwIfAborted();
        const data = unflatten(response.data.tree);
        return Object.fromEntries(
            Object.values(data)
                .map(getVersion)
                .filter(x => x != null) as [string, PatchGroup][]
        )
    }, [repoParts]);

}