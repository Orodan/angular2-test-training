import {BlogEntry} from '../domain/blog-entry';
import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class BlogService {

    constructor (private http: Http) {}

    getBlog (id: number): Observable<BlogEntry> {
        return this.http.get('/server/api/blogs/' + id)
            .map((res: Response) => {
                return BlogEntry.asBlogEntry(res.json());
            });
    }

    getBlogs (): Observable<BlogEntry[]> {
        return this.http.get('/server/api/blogs')
            .map((res: Response) => {
                return BlogEntry.asBlogEntries(res.json());
            }, this.getOptions());
    }

    saveBlog (blog: BlogEntry): Observable<Response> {
        if (blog.id) {
            return this.http.put('/server/api/blogs/' + blog.id, 
                    blog.json(), this.getOptions());
        }

        return this.http.post('/server/api/blogs',
                    blog.json(), this.getOptions());
    }

    private getOptions (): RequestOptions {
        let headers: Headers = new Headers();
        headers.append('content-type', 'application/json; charset=utf-8');
        
        let opts = new RequestOptions({headers: headers});
        opts.headers = headers;
        
        return opts;
    }

}