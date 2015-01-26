1. Put all clips, properly named, into a directory 
2. Make an empty directory for them to be copied into
3. Run `node scripts/load_clips_and_rename.js source_dir target_dir`
	- This will check the database to see if the clip already exists there
	- If not, it will add it
	- Then it copies the clip to the target_dir with the DB's clip ID as the name
4. Create another directory for the mobile versions
5. run `scripts/batch_process_video.js source_dir target_dir`
	- NOTE: the source_dir for this step should be the **target_dir** from step 2
6. Put the directories in their places as video/desktop and video/mobile.