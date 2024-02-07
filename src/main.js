import https from 'https';
import { load } from 'cheerio';

function crawlingData() {
  const PROBLEM_NUMBER = 1000;
  const API_URL = 'https://www.acmicpc.net/problem/';

  https.get(`${API_URL}/${PROBLEM_NUMBER}`, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res
      .on('end', () => {
        const $ = load(body);
        const title = $('#problem_title').text()?.trim();
        const problemBody = $('#problem-body');
        const description = problemBody.find('#problem_description').text()?.trim();
        const input = problemBody.find('#problem_input').text()?.trim();
        const output = problemBody.find('#problem_output').text()?.trim();
        const samples = [];
        const imgs = [];

        $('[id*=sample-input]').each((i, el) => {
          const input = $(el).text();
          const output = $(el).parent().parent().next().find('[id*=sample-output]').text();
          samples[i] = { input, output };
        });

        problemBody
          .find('#problem_description')
          .find('img')
          .each((_, el) => {
            const src = $(el).attr('src');
            if (!src) {
              return;
            } else {
              imgs.push(src);
            }
          });

        console.log('문제 제목:', title);
        console.log('문제 설명:', description);
        console.log('입력:', input);
        console.log('출력:', output);
        console.log('예제 입출력: ', samples);
        console.log('이미지: ', imgs);
      })
      .on('error', (error) => {
        console.error(`Error: ${error.message}`);
      });
  });
}

crawlingData();
