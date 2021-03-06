<?php
namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;

/**
 * Class CompanyDetailsSearch
 * @package app\models
 */
class CompanyDetailsSearch extends CompanyDetails
{
    /**
     * @inheritdoc
     */
    public function initAttributes()
    {
        // nothing todo
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [
                [
                    'shortName',
                ],
                'string',
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        return Model::scenarios();
    }

    /**
     * @param array $data
     * @return \yii\data\DataProviderInterface
     */
    public function search($data)
    {
        $table = self::tableName();

        $this->load($data, '');
        $query = self::find()
            ->groupBy("$table.id")
            ->orderBy(["$table.[[createdAt]]" => SORT_DESC]);


        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        return $dataProvider;
    }
}