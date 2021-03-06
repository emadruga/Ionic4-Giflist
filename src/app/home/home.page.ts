import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { RedditService } from '../services/reddit.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Plugins } from '@capacitor/core';

import { SettingsPage } from '../settings/settings.page';

import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';

const { Browser, Keyboard } = Plugins;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    private subredditForm: FormGroup;

    constructor(private dataService: DataService, private redditService: RedditService, private modalCtrl: ModalController){

	this.subredditForm = new FormGroup({
	    subredditControl: new FormControl('')
	});

    }

    ngOnInit(){

	this.redditService.load();

	this.subredditForm.get('subredditControl').valueChanges.pipe(
	    debounceTime(1500),
	    distinctUntilChanged()
	).subscribe((subreddit: any) => {

	    if(subreddit.length > 0){
		this.redditService.changeSubreddit(subreddit);
		Keyboard.hide().catch((err) => {
		    console.warn(err);
		});
	    }

	})

    }

    showComments(post): void {
	Browser.open({
	    toolbarColor: '#fff', 
	    url: 'http://reddit.com' + post.data.permalink, 
	    windowName: '_system'
	});
    }

    openSettings(): void {

	this.modalCtrl.create({
	    component: SettingsPage
	}).then((modal) => {

	    modal.onDidDismiss(() => {
		this.redditService.resetPosts();
	    });

	    modal.present();

	});

    }

    doLogin(): void {
	console.log("Sending info to database...");

	let personData = {
	    _id : "5b8ed4d10a382e78bcf67d0e"
	};
	
	this.redditService.saveApplicant(personData);
    }

    playVideo(e, post): void {

	console.log(e);

	//Create a reference to the video
	let video = e.target;

	//Toggle the video playing
	if(video.paused){

	    //Show the loader gif
	    video.play();

	    video.addEventListener("playing", (e) => {
		console.log("playing video");
	    });

	} else {
	    video.pause();
	}

    }

    loadMore(): void {
	this.redditService.nextPage();
    }

}
