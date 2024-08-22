import { FC, useState } from "react";
import { FaTrash } from "react-icons/fa";

import BasicButton from "@/components/button/basic-button";
import IconButton from "@/components/button/icon-button";
import NumberArrayInput from "@/components/input/number-array-input";
import NumberInput from "@/components/input/number-input";
import BasicSelect from "@/components/select/basic-select";
import CheckBox from "@/components/select/check-box";
import { ComparisonOperator, comparisonOperatorArr, comparisonOperatorJa } from "@/schema/enum";
import { ConstraintsByCandidate, EntryCohortConstraint, OptimizeConfig } from "@/schema/schedule";
import OptimizeConfigByCandidate from "./config-by-candidate";

type ScheduleOptimizeConfigProps = {
  config: OptimizeConfig;
  onSubmit: (config: OptimizeConfig) => void;
};

const ScheduleOptimizeConfig: FC<ScheduleOptimizeConfigProps> = ({ config, onSubmit }) => {
  const [activeConfig, setActiveConfig] = useState<OptimizeConfig>(config);
  const {
    entry_cohort_constraint,
    driver_level_constraint,
    basic_member_count_constraint,
    gender_consideration,
    candidate_constraints,
  } = activeConfig;

  const [entryCohortConstraintObj, setEntryCohortConstraintObj] = useState(entry_cohort_constraint);
  const [applySameRule, setApplySameRule] = useState(true);

  const addEntryCohortConstraintHandler = () => setEntryCohortConstraintObj((x) => [...x, [[1], "==", 1]]);
  const deleteEntryCohortConstraintHandler = (index: number) => () =>
    setEntryCohortConstraintObj((x) => x.filter((_, i) => i !== index));
  const updateCohortConstraintHandler = (index: number) => (cohorts: number[]) =>
    setEntryCohortConstraintObj((x) => x.map(([c, o, t], i) => (i === index ? [cohorts, o, t] : [c, o, t])));
  const updateOperatorHandler = (index: number) => (operator: ComparisonOperator) =>
    setEntryCohortConstraintObj((x) => x.map(([c, o, t], i) => (i === index ? [c, operator, t] : [c, o, t])));
  const updateThresholdHandler = (index: number) => (threshold: number) =>
    setEntryCohortConstraintObj((x) => x.map(([c, o, t], i) => (i === index ? [c, o, threshold] : [c, o, t])));

  const onChangeConfigByCandidate = (idx: number) => (constraints: ConstraintsByCandidate) => {
    const isChangingGroup =
      candidate_constraints[idx].group === null || constraints.group !== candidate_constraints[idx].group;

    if (!applySameRule || isChangingGroup) {
      setActiveConfig((x) => ({
        ...x,
        candidate_constraints: x.candidate_constraints.map((v, i) => (i === idx ? constraints : v)),
      }));
      return;
    }

    setActiveConfig((x) => ({
      ...x,
      candidate_constraints: x.candidate_constraints.map((v) => {
        const isSameGroup = v.group === constraints.group;
        return {
          ...v,
          tasks: isSameGroup ? structuredClone(constraints.tasks) : v.tasks,
          irregular_member_count_constraint: isSameGroup
            ? constraints.irregular_member_count_constraint
            : v.irregular_member_count_constraint,
        };
      }),
    }));
  };

  const onSubmitHandler = (config: OptimizeConfig, entryCohortConstraint: EntryCohortConstraint) => () => {
    const configToSubmit = {
      ...config,
      entry_cohort_constraint: entryCohortConstraint,
    };
    onSubmit(configToSubmit);
  };

  return (
    <div className="flex w-full flex-col space-y-4 pb-16">
      <ul className="w-full list-disc px-8 py-2">
        <li>最適化する際に考慮する制約を設定します。</li>
        <li>数値は半角数字で入力してください。</li>
        <li>あまりたくさんの条件を入れすぎると、解なしになるので注意してください。</li>
        <li>下の条件だけでは制約が足りないと感じる場合は、開発者にお問い合わせください。</li>
      </ul>
      <div className="w-full text-lg text-center">共通の設定</div>
      <div className="flex items-center space-x-2">
        <div className="w-40 shrink-0">入会期 人数制約</div>
        <div className="flex grow flex-col space-y-2">
          {entryCohortConstraintObj.map(([cohorts, operator, threshold], i) => (
            <div key={i} className="flex h-10 space-x-2">
              <div className="flex grow space-x-2 items-center">
                <NumberArrayInput
                  value={cohorts}
                  onChange={updateCohortConstraintHandler(i)}
                  min={1}
                  className="w-1/6"
                />
                <div className="w-16">期生が</div>
                <NumberInput value={threshold} onChange={updateThresholdHandler(i)} min={1} className="w-1/6" />
                <div className="w-6">人</div>
                <BasicSelect
                  value={operator}
                  options={comparisonOperatorArr.slice()}
                  onChange={updateOperatorHandler(i)}
                  className="w-1/3"
                  keyToLabel={comparisonOperatorJa}
                />
                <IconButton onClick={deleteEntryCohortConstraintHandler(i)}>
                  <FaTrash color="gray" />
                </IconButton>
              </div>
            </div>
          ))}
          <div className="h-10 shrink-0">
            <BasicButton onClick={addEntryCohortConstraintHandler}>条件を追加する</BasicButton>
          </div>
        </div>
      </div>
      <details className="w-full break-words text-sm px-4">
        <summary>
          <span className="p-2">説明</span>
        </summary>
        <ul className="list-disc break-words px-8 py-2">
          <li>入会期ごとに人数を制限することができます。</li>
          <li>複数の入会期を入力する場合は、カンマ区切りで入力してください。</li>
          <li>
            例えば、8、9 期合わせて 3 人、10 期 2 人以上としたい場合、「[8, 9] 期生が [3] 人 [と等しい]、[10] 期生が [2]
            人 [以上]」と入力します。
          </li>
        </ul>
      </details>
      <div className="flex h-10 items-center space-x-2">
        <div className="w-40 shrink-0">運転レベル制約</div>
        <div className="grow">
          <NumberInput
            value={driver_level_constraint}
            onChange={(v) => setActiveConfig((x) => ({ ...x, driver_level_constraint: v }))}
            min={0}
          />
        </div>
      </div>
      <details className="w-full break-words text-sm px-4">
        <summary>
          <span className="p-2">説明</span>
        </summary>
        <ul className="list-disc px-8 py-2">
          <li>車 1 台あたりのメンバーの運転レベルの総和がこの値以上であることを表します。</li>
          <li>車の台数は、メンバー数を 7 で割った値を切り上げたものです。</li>
          <li>運転レベルは、不可: 0、初心者: 1、独り立ち: 2、熟練: 3 で計算されます。</li>
        </ul>
      </details>
      <div className="flex h-10 items-center space-x-2">
        <div className="w-40 shrink-0">基本メンバー数制約</div>
        <div className="grow">
          <NumberInput
            value={basic_member_count_constraint}
            onChange={(v) => setActiveConfig((x) => ({ ...x, basic_member_count_constraint: v }))}
            min={1}
          />
        </div>
      </div>
      <details className="w-full break-words text-sm px-4">
        <summary>
          <span className="p-2">説明</span>
        </summary>
        <ul className="list-disc px-8 py-2">
          <li>1 訪問あたりの人数を設定します。</li>
        </ul>
      </details>
      <div className="flex h-10 items-center space-x-2">
        <div className="w-40 shrink-0">性別考慮</div>
        <div className="grow">
          <NumberArrayInput
            value={gender_consideration}
            onChange={(v) => setActiveConfig((x) => ({ ...x, gender_consideration: v }))}
            min={1}
          />
        </div>
      </div>
      <details className="w-full break-words text-sm px-4">
        <summary>
          <span className="p-2">説明</span>
        </summary>
        <ul className="list-disc px-8 py-2">
          <li>性別を考慮する入会期を設定します。</li>
          <li>このリストに含まれる入会期のメンバーが訪問する場合、他の同性メンバーが含まれることを要請します。</li>
          <li>例えば、[10] のとき、10 期の女性が 1 人、あとは男性、のような状況が排除されます。逆もまた然りです。</li>
          <li>
            [9, 10] とすると、9 または 10 期の女性が 1 人、あとは男性、のような状況が排除されます。逆もまた然りです
          </li>
        </ul>
      </details>
      <div className="w-full text-lg text-center pt-16">候補日ごとの設定</div>
      <details className="w-full break-words text-sm px-4">
        <summary>
          <span className="p-2">説明</span>
        </summary>
        <ul className="list-disc px-8 py-2">
          <li>グループ: 同じグループ名の候補日の中から1日だけ選ばれます。</li>
          <li>タスク: タスク名(人数) の形式で入力します。</li>
          <li>人数: この日だけの人数制約を入力します。基本メンバー数制約と異なる場合のみ入力してください。</li>
        </ul>
      </details>
      <div className="w-full flex flex-col">
        <div className="w-full flex text-center border-b border-slate-700 px-4 h-10 items-center">
          <div className="w-1/6">候補日</div>
          <div className="w-1/6">グループ</div>
          <div className="w-1/2">タスク</div>
          <div className="w-1/6">人数</div>
        </div>
        <div className="w-full flex flex-col h-[50vh] overflow-y-scroll">
          {candidate_constraints.map((constraints, idx) => (
            <OptimizeConfigByCandidate
              key={constraints.candidate.toISOString()}
              constraints={constraints}
              onChangeConstraints={onChangeConfigByCandidate(idx)}
              basicMemberCount={basic_member_count_constraint}
            />
          ))}
        </div>
        <div className="w-full flex items-center h-16 justify-center space-x-4">
          <CheckBox checked={applySameRule} onChange={() => setApplySameRule(!applySameRule)} />
          <div>同じグループの候補日に対して同じルールを適用する</div>
        </div>
      </div>
      <div className="w-full h-20 p-4">
        <BasicButton onClick={onSubmitHandler(activeConfig, entryCohortConstraintObj)}>条件を保存する</BasicButton>
      </div>
    </div>
  );
};

export default ScheduleOptimizeConfig;
