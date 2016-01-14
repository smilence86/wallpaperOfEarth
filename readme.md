Set wallpaper with earth's photo every 10min update!


How to use:

        1、create a cron script at /etc/cron.d/wallpaper, looks like:

            #!/bin/sh
            */10 * * * * cd [your path]/earthOfWallpaper/ && ./wallpaper.sh

        2、git clone the code to local, exec “sudo chmod +x wallpaper.sh” in project path.

        3、edit wallpaper.sh, set your node env path.

        4、exec “crontab /etc/cron.d/wallpaper” to run it.


It works well only in ubuntu 15.10 temporarily I have been tested.
