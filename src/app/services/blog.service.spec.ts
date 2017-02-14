import {async, getTestBed, TestBed} from '@angular/core/testing';
import {BaseRequestOptions, Response, ResponseOptions, RequestMethod, Http, HttpModule, XHRBackend} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from './blog.service';

describe('Blog Service', () => {

    let mockBackend: MockBackend;
    let blogService: BlogService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                BlogService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ],
            imports: [
                HttpModule
            ]
        });

        mockBackend = getTestBed().get(MockBackend);
        blogService = getTestBed().get(BlogService);        

        TestBed.compileComponents();
    }));

    it('should get blogs', async(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
           connection.mockRespond(new Response(new ResponseOptions({
               body: [
                   {
                       id: 26,
                       contentRendered: '<p><b>Hi there</b></p>',
                       contentMarkdown: '*Hi there*'
                   }
               ]
           })));

           blogService.getBlogs().subscribe((data) => {
                expect(data.length).toBe(1);
                expect(data[0].id).toBe(26);
                expect(data[0].contentMarkdown).toBe('*Hi there*');
                expect(data[0].contentRendered).toBe('<p><b>Hi there</b></p>');
           });
        });
    }));

    it('should fetch a single blog entry by a key', async(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            // Make sure the URL is correct
            expect(connection.request.url).toMatch(/\/server\/api\/blogs\/3/);

            connection.mockRespond(new Response(new ResponseOptions({
                body: {
                    id: 3,
                    contentRendered: '<p><b>Demo</b></p>',
                    contentMarkdown: '*Demo*'
                }
            })));
        });

        blogService.getBlog(3).subscribe((blogEntry) => {
            expect(blogEntry.id).toBe(3);
            expect(blogEntry.contentMarkdown).toBe('*Demo*');
            expect(blogEntry.contentRendered).toBe('<p><b>Demo</b></p>');
        });
    }));

    it('should insert new blog entries', async(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            // Make sure the method is correct
            expect(connection.request.method).toBe(RequestMethod.Post);

            connection.mockRespond(new Response(new ResponseOptions({status: 201})));
        });

        let post: BlogEntry = new BlogEntry('Blog Entry', '<p><b>Hi</b></p>', '*Hi*', null);
        blogService.saveBlog(post).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.status).toBe(201);
        });
    }));

    it('should save updates to an existing blog entry', async(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            // Make sure the method is correct
            expect(connection.request.method).toBe(RequestMethod.Put);

            connection.mockRespond(new Response(new ResponseOptions({status: 204})));
        });

        let post: BlogEntry = new BlogEntry('Blog Entry', '<p><b>Hi</b></p>', '*Hi*', 10);
        blogService.saveBlog(post).subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.status).toBe(204);
        });
    }));

});