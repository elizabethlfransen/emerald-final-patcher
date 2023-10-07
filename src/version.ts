export class Version {
    private static readonly REGEX = /(\d+)\.(\d+)/;
    readonly major: number;
    readonly minor: number;


    constructor(major: number, minor: number) {
        this.major = major;
        this.minor = minor;
    }

    public static parse(str: string): Version | null {
        const parts = Version.REGEX.exec(str);
        if(parts == null) return null;
        return new Version(Number.parseInt(parts[1]), Number.parseInt(parts[2]));
    }

    public toString() {
        return `${this.major}.${this.minor}`
    }

    public compareTo(other: Version): number {
        if(this.major < other.major) return -1;
        if(this.major > other.major) return 1;

        if(this.minor < other.minor) return -1;
        if(this.minor > other.minor) return 1;

        return 0;
    }
}