export class BlogEntry {

    constructor (public title: String, 
                    public contentRendered: String,
                    public contentMarkdown: String, 
                    public id: number) {}

    static asBlogEntries(jsonArray: Array<Object>) {
        return jsonArray.map((datum) => BlogEntry.asBlogEntry(datum));
    }

    static asBlogEntry (json: any) {
        let id: number = json['id'],
            title: string = json['title'],
            contentRendered: string = json['contentRendered'],
            contentMarkdown: string = json['contentMarkdown'];

        return new BlogEntry(title, contentRendered, contentMarkdown, id);
    }

    json () {
        return JSON.stringify(this);
    }

    clone () {
        return new BlogEntry(this.title, this.contentRendered, this.contentMarkdown, this.id);
    }

}