# SLSV 2027 视觉物料展示站

只读展示：大家可以浏览、查看大图、下载原图。修改统一由负责人通过 Claude 完成。

- 原稿放在 `asserts/`，**永远不覆盖**
- 修改后的版本放在 `versions/<slug>/v2.png` 等，并在 `content/catalog.json` 里登记版本和修改说明
- 分类、标题也都在 `content/catalog.json` 里

## 运行

```bash
npm install
npm run dev     # 会先生成预览图，然后打开 http://localhost:3000
```
