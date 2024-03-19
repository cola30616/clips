import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  // ffmpeg 一次只能跑一段命令，避免多段命令執行產生bug
  isRunning = false;
  isReady = false;
  private ffmepg;
  constructor() {
    this.ffmepg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmepg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    // 轉成2進位檔
    const data = await fetchFile(file);

    this.ffmepg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        // Input
        '-i',
        file.name,
        // Output Options
        // 在影片第一秒時截圖
        '-ss',
        `00:00:0${second}`,
        // 限定一禎
        '-frames:v',
        '1',
        // size
        '-filter:v',
        'scale=510:-1',
        // Output
        `output_0${second}.png`
      );
    });
    // 生成螢幕截圖
    await this.ffmepg.run(...commands);

    // 從2進位轉URL
    const screenshots: string[] = [];
    seconds.forEach((second) => {
      const screenshotFile = this.ffmepg.FS(
        'readFile',
        `output_0${second}.png`
      );
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png',
      });
      const screenshotUrl = URL.createObjectURL(screenshotBlob);

      screenshots.push(screenshotUrl);
    });
    this.isRunning = false;
    return screenshots;
  }

  async blobFormUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
