# About Care Together

Example Website: https://care-together.hnd1.zeabur.app/ (帳號密碼，請參照下方共用帳號的部分)  
(目前撤掉服務了，不好意思)

有鑑於現代慢性病年齡逐漸下降，藉由一同互助關注，勝過獨自努力打拼，因此設計這樣的資療資訊平台。對使用者而言，不同的角色，有不同的功能可以操作。

* 對個案而言：
1. 使用者可以註冊/登入/登出網站
2. 使用者可以輸入自己的血糖、血壓等資料
3. 使用者可以查詢/加入好友，並且可以查看對方的檢驗資料
4. 透過比較頁面來一較高下

* 對醫事人員：
1. 可以透過後台查閱個案每天的健康狀況
2. 查閱後可以批註，並且視情況給予警示
3. 可以記錄個案每次回診、照護的病例

## Feature

### 使用者－患者
1. 新增當天個人資料
![image](https://github.com/Wei-Hsiang86/care-together/blob/main/public/demo/add-data.gif)

2. 加好友
![image](https://github.com/Wei-Hsiang86/care-together/blob/main/public/demo/add-friend.gif)

3. 對好友狀況留言
![image](https://github.com/Wei-Hsiang86/care-together/blob/main/public/demo/add-comment.gif)

### 使用者－醫事人員
1. 對患者提出叮囑
![image](https://github.com/Wei-Hsiang86/care-together/blob/main/public/demo/add-note.gif)

2. 撰寫醫療紀錄
![image](https://github.com/Wei-Hsiang86/care-together/blob/main/public/demo/add-record.gif)

### 其餘請至 youtube 連結觀看

# How to use?

1. Initialize
```
npm install
```

2. 設定資料庫：請留意，這裡需要與 config/config.json 中設定的一致
```
// 到 MySQL 去建立資料庫
create database forum;
```

3. 共用帳號：可以依下方範例設定帳號密碼

第一組帳號是醫護人員帳號：
  * email: root@example.com
  * password: 123456

第二、三組等...，其餘多組帳號為使用者(client)帳號：
  * email: user1@example.com
  * password: 123456

  * email: user2@example.com
  * password: 123456

# Others

* 未來展望：希望可以連結 line，讓個案可以在聊天室輸入資訊，就可以直接更新、獲得資訊

* 製作時思考的地方與難點：  
1. 朋友關係的 data table 設計，是否需要額外新增一個 friendship table
2. 承第一點，如果多設計一個資料表，主要是為了查詢方便，如果後續使用者想將朋友設定群組也會較為方便，但缺點就是這個 table 可能會越來越肥大
3. acquaintance 資料表，也許可以新增像是：送出邀請時間、送出文字等等
4. 另外，好友刪除的時機點也糾結了一番。要在通過邀請時就刪除 acquaintance 的相關資料，還是要通通等到取消好友關係再刪除
