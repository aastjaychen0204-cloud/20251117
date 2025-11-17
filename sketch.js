let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

// --- 選單變數 ---
// 將選單項目與 URL 整合，方便管理
let menuItems = [{
	text: "第一單元作品", url: "https://hackmd.io/@mx6_q8HhTiKz_hfiJFdGGQ/BypJoB7kWe"
}, {
	text: "第一單元講義", url: "https://hackmd.io/@mx6_q8HhTiKz_hfiJFdGGQ/ry8YDmAjlg"
}, {
	text: "期中作業講義", url: "https://hackmd.io/@mx6_q8HhTiKz_hfiJFdGGQ/SJ-ZnTAkZe"
}, {
	text: "測驗系統", url: "https://aastjaychen0204-cloud.github.io/20251105/"
}, {
	text: "回到首頁", url: null
}];
let menuWidth = 250; // 選單寬度
let menuX; // 選單目前的 X 座標
let targetMenuX; // 選單的目標 X 座標

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	objs.push(new DynamicShape());

	// 初始化選單位置，使其一開始是隱藏的
	menuX = -menuWidth;
	targetMenuX = -menuWidth;
}

function draw() {
	background(255);
	for (let i of objs) {
		i.run();
	}

	if (frameCount % int(random([15, 30])) == 0) {
		let addNum = int(random(1, 30));
		for (let i = 0; i < addNum; i++) {
			objs.push(new DynamicShape());
		}
	}
	for (let i = 0; i < objs.length; i++) {
		if (objs[i].isDead) {
			objs.splice(i, 1);
		}
	}

	// --- 繪製學號和姓名 ---
	push();
	fill(0); // 文字顏色設為黑色
	textSize(72); // 設定文字大小
	textAlign(CENTER);
	text("414730829 陳O傑", width / 2, 100); // 在畫布頂部中央顯示文字
	pop();

	// --- 選單邏輯 ---
	// 檢查滑鼠位置來決定選單是否要滑出
	if (mouseX < 100) {
		targetMenuX = 0; // 滑出
	} else {
		targetMenuX = -menuWidth; // 收回
	}
	// 使用 lerp 產生平滑的動畫效果
	menuX = lerp(menuX, targetMenuX, 0.1);
	drawMenu();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
	// 檢查選單是否為可見狀態
	if (menuX > -menuWidth + 10) {
		// 遍歷所有選單項目，檢查點擊位置
		for (let i = 0; i < menuItems.length; i++) {
			const item = menuItems[i];
			const itemY = 100 + i * 60;

			// 檢查滑鼠是否點擊在當前項目範圍內
			if (mouseX > menuX && mouseX < menuX + menuWidth && mouseY > itemY && mouseY < itemY + 60) {
				// 如果該項目有 URL，則在新分頁中開啟
				if (item.url) {
					window.open(item.url, '_blank');
				}
				break; // 找到點擊目標後，跳出迴圈
			}
		}
	}
}

function easeInOutExpo(x) {
	return x === 0 ? 0 :
		x === 1 ?
		1 :
		x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
		(2 - Math.pow(2, -20 * x + 10)) / 2;
}

function drawMenu() {
	push(); // 儲存目前的繪圖設定

	// 繪製選單背景
	fill(50, 50, 50, 220); // 半透明深灰色
	noStroke();
	rectMode(CORNER); // 暫時改為 CORNER 模式以方便繪製矩形
	rect(menuX, 0, menuWidth, height);

	// 繪製選單文字
	fill(255); // 白色文字
	textSize(32);
	textAlign(LEFT, TOP);
	for (let i = 0; i < menuItems.length; i++) {
		text(menuItems[i].text, menuX + 20, 100 + i * 60); // 加上邊距
	}
	pop(); // 恢復原本的繪圖設定 (例如 rectMode(CENTER))
}

class DynamicShape {
	constructor() {
		this.x = random(0.3, 0.7) * width;
		this.y = random(0.3, 0.7) * height;
		this.reductionRatio = 1;
		this.shapeType = int(random(4));
		this.animationType = 0;
		this.maxActionPoints = int(random(2, 5));
		this.actionPoints = this.maxActionPoints;
		this.elapsedT = 0;
		this.size = 0;
		this.sizeMax = width * random(0.01, 0.05);
		this.fromSize = 0;
		this.init();
		this.isDead = false;
		this.clr = random(colors);
		this.changeShape = true;
		this.ang = int(random(2)) * PI * 0.25;
		this.lineSW = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		if (this.animationType == 1) scale(1, this.reductionRatio);
		if (this.animationType == 2) scale(this.reductionRatio, 1);
		fill(this.clr);
		stroke(this.clr);
		strokeWeight(this.size * 0.05);
		if (this.shapeType == 0) {
			noStroke();
			circle(0, 0, this.size);
		} else if (this.shapeType == 1) {
			noFill();
			circle(0, 0, this.size);
		} else if (this.shapeType == 2) {
			noStroke();
			rect(0, 0, this.size, this.size);
		} else if (this.shapeType == 3) {
			noFill();
			rect(0, 0, this.size * 0.9, this.size * 0.9);
		} else if (this.shapeType == 4) {
			line(0, -this.size * 0.45, 0, this.size * 0.45);
			line(-this.size * 0.45, 0, this.size * 0.45, 0);
		}
		pop();
		strokeWeight(this.lineSW);
		stroke(this.clr);
		line(this.x, this.y, this.fromX, this.fromY);
	}

	move() {
		let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
		if (0 < this.elapsedT && this.elapsedT < this.duration) {
			if (this.actionPoints == this.maxActionPoints) {
				this.size = lerp(0, this.sizeMax, n);
			} else if (this.actionPoints > 0) {
				if (this.animationType == 0) {
					this.size = lerp(this.fromSize, this.toSize, n);
				} else if (this.animationType == 1) {
					this.x = lerp(this.fromX, this.toX, n);
					this.lineSW = lerp(0, this.size / 5, sin(n * PI));
				} else if (this.animationType == 2) {
					this.y = lerp(this.fromY, this.toY, n);
					this.lineSW = lerp(0, this.size / 5, sin(n * PI));
				} else if (this.animationType == 3) {
					if (this.changeShape == true) {
						this.shapeType = int(random(5));
						this.changeShape = false;
					}
				}
				this.reductionRatio = lerp(1, 0.3, sin(n * PI));
			} else {
				this.size = lerp(this.fromSize, 0, n);
			}
		}

		this.elapsedT++;
		if (this.elapsedT > this.duration) {
			this.actionPoints--;
			this.init();
		}
		if (this.actionPoints < 0) {
			this.isDead = true;
		}
	}

	run() {
		this.show();
		this.move();
	}

	init() {
		this.elapsedT = 0;
		this.fromSize = this.size;
		this.toSize = this.sizeMax * random(0.5, 1.5);
		this.fromX = this.x;
		this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
		this.fromY = this.y;
		this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
		this.animationType = int(random(3));
		this.duration = random(20, 50);
	}
}