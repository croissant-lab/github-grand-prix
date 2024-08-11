# GitHub Grand Prix

## 概要

## 環境

- Node.js

## 初期設定

1. pnpmをインストール

   ```shell
   npm install -g pnpm@latest-8
   ```

2. リポジトリをクローン

   ```shell
   git clone git@github.com:croissant-lab/github-grand-prix.git
   ```

3. VS Code起動後、右下に表示された推奨拡張機能をインストールする

## 利用技術

![image](https://github.com/user-attachments/assets/7bcc8159-eb7e-4b4d-84eb-e296a8591b04)

## 開発方法

### 1. 初回のみ

1. `pnpm install`を実行
1. GitHubのPersonal Access Tokenを作成
   1. `.env`ファイルをリポジトリのルートディレクトリに作成

      ```sh
       VITE_GITHUB_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN"
       VITE_ENDPOINT="https://api.github.com/graphql"
       ```

### 2. 毎回実行

下記コマンドを実行

- `pnpm dev`・・・開発用サーバーを起動
- `pnpm codegen:watch`・・・GraphQLの型定義を生成

### 3. 開発の流れ

#### 3-1. Queryの作成

1. `/services`以下でQueryを作成

   ```ts
   import { graphql } from '@/src/gql';
   
   graphql(`
     query <任意のQuery名>{
       viewer {
         login
       }
     }
   `);
   ```

2. 保存したタイミングで`graphql-codegen`が起動し、対象のQueryに対応する型定義、Tanstack Queryのhooksが生成される
（`pnpm codegen:watch`の立ち上げが必要）

#### 3-2. Hooksの呼び出し

1. 任意のファイルで`use<任意のQuery名>`を呼び出すと、型定義に従ったデータが取得できる

   ```ts
   import { use<任意のQuery名> } from '@/src/gql/graphql';
   
   const { data, loading, error } = use<任意のQuery名>Query();
   ```

### おとくなけいじばん

1. Query作成時は補完が効きます。VS Codeの補完機能を活用しましょう

1. [Altair](https://altairgraphql.dev/)からも叩けるようにしています。  
`/docs/altair`のファイルをimportしてください（別途`header`の`Authorization`の設定が必要です）
   - [Altair GraphQLクライアントIDEを使用する](https://docs.github.com/ja/graphql/guides/using-the-explorer#using-the-altair-graphql-client-ide)

### 参考リンク

- [GitHub GraphQL API](https://docs.github.com/ja/graphql)
