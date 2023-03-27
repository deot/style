import * as ChildProcess from "node:child_process";
import chokidar from 'chokidar';

class Dev {
	subprocess: ChildProcess.ChildProcessByStdio<null, null, null> | null;

	impl() {
		this.watch();
		this.restart();


	}

	restart() {
		if (this.subprocess) {
			this.subprocess.kill('SIGINT'); // 包含退出jest子进程（这里的退出close(code = null）)
			this.subprocess = null;
		}

		this.subprocess = ChildProcess.spawn(
			'jest', 
			['--watchAll'],
			{
				stdio: ['inherit', 'inherit', 'inherit']
			}
		);

		this.subprocess.on('close', (code) => {
			if (code === 0) process.exit();
		});
	}

	// 监听scss的修改，重新执行测试，暂未找到jest能支持scss监听测试
	watch() {
		const watcher = chokidar.watch('./src/**/*.{css,scss}', { ignoreInitial: true });

		watcher.on('all', () => {
			this.restart();
		});
	}
}


new Dev().impl();